import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadTypeScript } from './helpers/load-typescript.mjs';

async function setup(options = {}) {
  const task = {
    id: 1, name: 'Test task', project_id: 'project', github_issue_number: null,
    github_push_pending_at: null, projects: { github_repo: 'org/repo' },
    ...options.task,
  };
  const calls = [];
  let issueCalls = 0;
  const issue = { number: 42, html_url: 'https://github.com/org/repo/issues/42', assignees: [] };

  const supabase = {
    auth: { getUser: async () => ({ data: { user: options.unauthenticated ? null : { id: 'user' } }, error: null }) },
    from(table) {
      const query = { table, filters: [], values: null, operation: 'select', columns: null, or: null };
      const builder = {
        select(columns) { query.columns = columns; return builder; },
        single() { return builder; },
        maybeSingle() { return builder; },
        update(values) { query.operation = 'update'; query.values = values; return builder; },
        insert(values) { query.operation = 'insert'; query.values = values; return builder; },
        eq(column, value) { query.filters.push([column, value]); return builder; },
        is(column, value) { query.filters.push([column, value]); return builder; },
        or(filter) { query.or = filter; return builder; },
        then(resolve, reject) {
          return Promise.resolve().then(() => {
            calls.push(query);
            if (table === 'task_assignments') {
              if (options.assignmentThrows) throw new Error('Unexpected assignment lookup failure');
              return { data: [], error: null };
            }
            if (table !== 'tasks') return { data: null, error: null };
            if (query.operation === 'select') return { data: options.missingTask ? null : { ...task }, error: null };

            const kind = query.values.github_push_pending_at ? 'claim'
              : query.values.github_issue_number ? 'link' : 'clear';
            query.kind = kind;
            if (kind === 'claim') options.beforeClaim?.(task);
            if (options.fail === kind) return { data: null, error: { message: `${kind} failed` } };

            let matches = query.filters.every(([column, value]) => task[column] === value);
            if (query.or) {
              const [empty, stale] = query.or.split(',');
              assert.equal(empty, 'github_push_pending_at.is.null');
              assert.ok(stale.startsWith('github_push_pending_at.lt.'));
              const cutoff = Date.parse(stale.slice('github_push_pending_at.lt.'.length));
              matches &&= task.github_push_pending_at === null || Date.parse(task.github_push_pending_at) < cutoff;
            }
            if (!matches) return { data: [], error: null };
            Object.assign(task, query.values);
            return { data: query.columns ? [{ id: task.id }] : null, error: null };
          }).then(resolve, reject);
        },
      };
      return builder;
    },
  };
  const { POST } = await loadTypeScript(new URL('../src/app/api/github/create-issue/route.ts', import.meta.url), {
    'next/server': { NextRequest: Request, NextResponse: Response },
    '@/lib/supabase/server': { createClient: async () => supabase },
    '@/lib/github/githubApp': { getInstallationClient: async () => { throw new Error('Unexpected app fallback'); } },
    '@/lib/github/userOctokit': {
      getUserOctokit: async () => {
        if (options.authFails) throw new Error('GitHub authentication failed');
        return { request: async () => {
          issueCalls++;
          await options.onCreate?.(task);
          return { data: issue };
        } };
      },
    },
    '@/lib/permissions/githubAccess': { userCanActOnTaskIssue: async () => ({ allowed: !options.denied, reason: 'Access denied' }) },
  });
  return {
    task, calls, get issueCalls() { return issueCalls; },
    post: (taskId = 1) => POST(new Request('http://localhost/api/github/create-issue', {
      method: 'POST', body: JSON.stringify({ taskId }),
    })),
  };
}

test('overlapping automatic and manual pushes create exactly one GitHub issue', async () => {
  let release;
  let started;
  const gate = new Promise((resolve) => { release = resolve; });
  const creating = new Promise((resolve) => { started = resolve; });
  const s = await setup({ onCreate: async () => { started(); await gate; } });
  const first = s.post();
  await creating;
  let timeout;
  try {
    const second = await Promise.race([
      s.post(),
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Overlapping push reached GitHub instead of returning 409')), 250);
      }),
    ]);
    assert.equal(second.status, 409);
    assert.equal(s.issueCalls, 1);
    assert.ok(s.task.github_push_pending_at, 'the rejected caller must not clear the active lock');
  } finally {
    clearTimeout(timeout);
    release();
  }
  const response = await first;
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { issueNumber: 42, issueUrl: 'https://github.com/org/repo/issues/42' });
  assert.equal(s.task.github_issue_number, 42);
  assert.equal(s.task.github_push_pending_at, null);
});

test('two requests that both read the unlinked task still have only one winner', async () => {
  const s = await setup();
  const responses = await Promise.all([s.post(), s.post()]);
  assert.deepEqual(responses.map((r) => r.status).sort(), [200, 409]);
  assert.equal(s.issueCalls, 1);
  const claims = s.calls.filter((q) => q.kind === 'claim');
  assert.equal(claims.length, 2);
  assert.ok(claims.every((q) => q.columns === 'id'));
  assert.ok(claims.every((q) => q.filters.some(([key, value]) => key === 'github_issue_number' && value === null)));
});

test('a fresh pending push returns 409 before GitHub access', async () => {
  const pendingAt = new Date(Date.now() - 30_000).toISOString();
  const s = await setup({ task: { github_push_pending_at: pendingAt } });
  assert.equal((await s.post()).status, 409);
  assert.equal(s.issueCalls, 0);
  assert.equal(s.task.github_push_pending_at, pendingAt);
});

test('an abandoned lock older than two minutes can be reclaimed', async () => {
  const s = await setup({ task: { github_push_pending_at: new Date(Date.now() - 180_000).toISOString() } });
  assert.equal((await s.post()).status, 200);
  assert.equal(s.issueCalls, 1);
  assert.equal(s.task.github_push_pending_at, null);
});

test('a task linked between the initial read and claim is rejected', async () => {
  const s = await setup({ beforeClaim: (task) => { task.github_issue_number = 99; } });
  assert.equal((await s.post()).status, 409);
  assert.equal(s.issueCalls, 0);
  assert.equal(s.task.github_push_pending_at, null);
});

test('a lock database failure returns 500 without creating an issue', async () => {
  const s = await setup({ fail: 'claim' });
  assert.equal((await s.post()).status, 500);
  assert.equal(s.issueCalls, 0);
  assert.equal(s.calls.some((q) => q.kind === 'clear'), false);
});

test('a failed task link releases the owned lock after GitHub creates the issue', async () => {
  const s = await setup({ fail: 'link' });
  const response = await s.post();
  assert.equal(response.status, 500);
  assert.match((await response.json()).error, /Issue created on GitHub, but failed to link/);
  assert.equal(s.issueCalls, 1);
  assert.equal(s.task.github_push_pending_at, null);
  const claim = s.calls.find((q) => q.kind === 'claim');
  const clear = s.calls.find((q) => q.kind === 'clear');
  assert.ok(clear.filters.some(([key, value]) => key === 'github_push_pending_at' && value === claim.values.github_push_pending_at));
});

for (const [name, options] of [
  ['GitHub authentication', { authFails: true }],
  ['GitHub issue creation', { onCreate: () => { throw new Error('GitHub failed'); } }],
  ['an unexpected post-lock exception', { assignmentThrows: true }],
]) {
  test(`${name} failure releases the owned lock`, async () => {
    const s = await setup(options);
    assert.equal((await s.post()).status, 500);
    assert.equal(s.task.github_push_pending_at, null);
  });
}

test('cleanup from an expired request cannot clear a newer request lock', async () => {
  const replacement = new Date(Date.now() + 1_000).toISOString();
  const s = await setup({ onCreate: (task) => {
    task.github_push_pending_at = replacement;
    throw new Error('Old request failed after another request reclaimed the lock');
  } });
  assert.equal((await s.post()).status, 500);
  assert.equal(s.task.github_push_pending_at, replacement);
});

test('cleanup errors preserve the original failure response and allow later stale recovery', async () => {
  const s = await setup({ fail: 'clear', authFails: true });
  const response = await s.post();
  assert.equal(response.status, 500);
  assert.match((await response.json()).error, /Failed to connect/);
  assert.ok(s.task.github_push_pending_at);
});

test('an expired request cannot overwrite a newer linked GitHub issue', async () => {
  const replacement = new Date(Date.now() + 1_000).toISOString();
  const s = await setup({ onCreate: (task) => {
    task.github_push_pending_at = replacement;
    task.github_issue_number = 99;
    task.github_issue_url = 'https://github.com/org/repo/issues/99';
  } });
  const response = await s.post();
  assert.equal(response.status, 409);
  assert.equal(s.task.github_issue_number, 99);
  assert.equal(s.task.github_issue_url, 'https://github.com/org/repo/issues/99');
  assert.equal(s.task.github_push_pending_at, replacement);
  assert.equal((await response.json()).issueNumber, 42, 'report the newly created issue for reconciliation');
});

test('an expired request cannot clear a replacement lock while saving its result', async () => {
  const replacement = new Date(Date.now() + 1_000).toISOString();
  const s = await setup({ onCreate: (task) => { task.github_push_pending_at = replacement; } });
  assert.equal((await s.post()).status, 409);
  assert.equal(s.task.github_issue_number, null);
  assert.equal(s.task.github_push_pending_at, replacement);
});

test('a webhook linking the same issue before the HTTP response is accepted as success', async () => {
  const s = await setup({ onCreate: (task) => {
    task.github_issue_number = 42;
    task.github_issue_url = 'https://github.com/org/repo/issues/42';
    task.github_push_pending_at = null;
  } });
  assert.equal((await s.post()).status, 200);
  assert.equal(s.task.github_issue_number, 42);
  assert.equal(s.task.github_push_pending_at, null);
});

test('a burst of 64 concurrent pushes creates only one issue', async () => {
  const s = await setup();
  const responses = await Promise.all(Array.from({ length: 64 }, () => s.post()));
  assert.equal(responses.filter(r => r.status === 200).length, 1);
  assert.equal(responses.filter(r => r.status === 409).length, 63);
  assert.equal(s.issueCalls, 1);
});

for (const [age, expected] of [[120_001, 200], [120_000, 409], [119_999, 409], [-1_000, 409]]) {
  test(`lock age ${age}ms respects the strict two-minute boundary`, async (t) => {
    const now = Date.parse('2026-11-16T12:00:00Z');
    t.mock.timers.enable({ apis: ['Date'], now });
    const s = await setup({ task: { github_push_pending_at: new Date(now - age).toISOString() } });
    assert.equal((await s.post()).status, expected);
    assert.equal(s.issueCalls, expected === 200 ? 1 : 0);
  });
}

for (const [name, options, taskId, status] of [
  ['unauthenticated caller', { unauthenticated: true }, 1, 401],
  ['caller without task permissions', { denied: true }, 1, 403],
  ['missing task ID', {}, null, 400],
  ['missing task', { missingTask: true }, 1, 404],
  ['already linked task', { task: { github_issue_number: 99 } }, 1, 409],
]) {
  test(`${name} cannot claim a lock or create a GitHub issue`, async () => {
    const s = await setup(options);
    assert.equal((await s.post(taskId)).status, status);
    assert.equal(s.issueCalls, 0);
    assert.equal(s.calls.some(q => q.operation !== 'select'), false);
  });
}
