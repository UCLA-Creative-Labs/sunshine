import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadTypeScript } from './helpers/load-typescript.mjs';

const issue = {
  id: 123, node_id: 'issue-node', number: 10, title: 'Issue title', body: 'Details',
  html_url: 'https://github.com/org/repo/issues/10', state: 'open',
  assignees: [{ login: 'Developer' }],
};
const issueEvent = (action) => ({
  deliveryId: 'delivery', eventType: 'issues',
  payload: { action, repository: { full_name: 'org/repo' }, issue },
});
const prEvent = (action = 'opened') => ({
  deliveryId: 'delivery', eventType: 'pull_request',
  payload: { action, repository: { full_name: 'org/repo' }, pull_request: {
    id: 456, node_id: 'pr-node', number: 20, body: 'Closes #10',
    html_url: 'https://github.com/org/repo/pull/20', merged: true,
  } },
});

const step = (table, operation, data = null, context = '') => ({ table, operation, data, context });
const initial = () => [
  step('projects', 'select', { id: 'project' }, 'project lookup'),
  step('github_integrations', 'upsert', { id: 7 }, 'github_integrations upsert'),
];
const existingTask = () => step('tasks', 'select', { id: 42 }, 'task lookup');
const assignments = () => [
  step('task_assignments', 'delete', null, 'clearing assignments'),
  step('profiles', 'select', [{ id: 'profile' }], 'assignee profile lookup'),
  step('task_assignments', 'insert', null, 'saving assignments'),
];
const completed = () => ({ ...step('github_integrations', 'update'), values: { processed: true } });
const recorded = () => ({ ...step('github_integrations', 'update'), values: { processed: false, processed_at: null } });

function database(steps, state = { processed: false, processed_at: null, error_message: null }) {
  const calls = [];
  const queue = [...steps];
  const client = {
    from(table) {
      const query = { table, operation: 'select', values: null, filters: [] };
      const builder = {
        select() { return builder; },
        upsert(values) { query.operation = 'upsert'; query.values = values; return builder; },
        update(values) { query.operation = 'update'; query.values = values; return builder; },
        insert(values) { query.operation = 'insert'; query.values = values; return builder; },
        delete() { query.operation = 'delete'; return builder; },
        eq(...args) { query.filters.push(args); return builder; },
        is(...args) { query.filters.push(args); return builder; },
        not(...args) { query.filters.push(args); return builder; },
        gte(...args) { query.filters.push(args); return builder; },
        in(...args) { query.filters.push(args); return builder; },
        order() { return builder; },
        limit() { return builder; },
        maybeSingle() { return builder; },
        single() { return builder; },
        then(resolve, reject) {
          return Promise.resolve().then(() => {
            calls.push(query);
            const expected = queue.shift();
            assert.ok(expected, `Unexpected query: ${table} ${query.operation}`);
            assert.equal(table, expected.table);
            assert.equal(query.operation, expected.operation);
            for (const [key, value] of Object.entries(expected.values ?? {})) {
              assert.deepEqual(query.values[key], value);
            }
            if (expected.throws) throw new Error(expected.throws);
            if (expected.error) return { data: null, error: { message: expected.error } };
            if (table === 'github_integrations') Object.assign(state, query.values);
            return { data: expected.data, error: null };
          }).then(resolve, reject);
        },
      };
      return builder;
    },
  };
  return { client, calls, state, assertComplete: () => assert.equal(queue.length, 0, 'All expected queries must run') };
}

async function processor(options = {}) {
  const notifications = [];
  const { processEvent } = await loadTypeScript(new URL('../src/lib/services/githubWebhookProcessor.ts', import.meta.url), {
    './notificationService': {
      mapNotificationAction: (type, action) => ['assigned', 'unassigned'].includes(action) ? null : `${type}_${action}`,
      dispatchNotifications: async (...args) => {
        notifications.push(args);
        if (options.notificationFails) throw new Error('Notification outage');
      },
    },
  });
  return { processEvent, notifications };
}

const scenarios = [
  { name: 'edited issue', event: issueEvent('edited'), steps: [
    existingTask(), step('tasks', 'update', null, 'updating task'),
  ] },
  { name: 'closed issue', event: issueEvent('closed'), steps: [
    existingTask(), step('tasks', 'update', null, 'closing task'),
  ] },
  { name: 'assigned issue', event: issueEvent('assigned'), steps: [existingTask(), ...assignments()] },
  { name: 'new issue', event: issueEvent('opened'), steps: [
    step('tasks', 'select', null, 'task lookup'),
    step('tasks', 'select', null, 'pending push lookup'),
    step('tasks', 'upsert', { id: 42 }, 'task upsert'),
    step('github_integrations', 'update', null, 'linking integration'),
    ...assignments(), step('activity_log', 'insert', null, 'activity log insert'),
  ] },
  { name: 'pending push bounce-back', event: issueEvent('opened'), steps: [
    step('tasks', 'select', null, 'task lookup'),
    step('tasks', 'select', { id: 42 }, 'pending push lookup'),
    step('tasks', 'update', null, 'updating task'),
    step('tasks', 'update', null, 'linking pending task'),
    step('github_integrations', 'update', null, 'linking integration'),
    ...assignments(),
  ] },
  { name: 'pull request', event: prEvent(), steps: [
    existingTask(), step('tasks', 'update', null, 'updating task'),
  ] },
];

for (const scenario of scenarios) {
  for (let index = 0; index < scenario.steps.length; index++) {
    const failed = scenario.steps[index];
    test(`${scenario.name}: ${failed.context} error keeps the event unprocessed`, async () => {
      const db = database([
        ...initial(), ...scenario.steps.slice(0, index),
        { ...failed, error: 'database outage' }, recorded(),
      ]);
      const p = await processor();
      await assert.rejects(p.processEvent(db.client, scenario.event), (error) => {
        assert.ok(error.message.includes(failed.context), error.message);
        assert.match(error.message, /database outage/);
        return true;
      });
      assert.equal(db.state.processed, false);
      assert.equal(db.state.processed_at, null);
      assert.ok(db.state.error_message.includes(failed.context));
      assert.equal(db.calls.some((q) => q.values?.processed === true), false);
      assert.equal(p.notifications.length, 0);
      db.assertComplete();
    });
  }

  test(`${scenario.name}: successful writes precede processed=true`, async () => {
    const db = database([...initial(), ...scenario.steps, completed()]);
    const p = await processor();
    await p.processEvent(db.client, scenario.event);
    assert.equal(db.state.processed, true);
    assert.ok(db.state.processed_at);
    assert.equal(db.calls.at(-1).values.processed, true);
    db.assertComplete();
  });
}

test('a failed final processed write is recorded and remains eligible for recovery', async () => {
  const db = database([...initial(), ...scenarios[0].steps,
    { ...completed(), error: 'commit unavailable' }, recorded(),
  ]);
  const p = await processor();
  await assert.rejects(p.processEvent(db.client, issueEvent('edited')), /marking delivery delivery processed failed: commit unavailable/);
  assert.equal(db.state.processed, false);
  assert.equal(db.state.processed_at, null);
  assert.match(db.state.error_message, /commit unavailable/);
  assert.equal(p.notifications.length, 0);
  db.assertComplete();
});

test('recovery succeeds after a transient write failure and clears the previous error', async () => {
  const p = await processor();
  const failed = database([...initial(), existingTask(),
    { ...step('tasks', 'update'), error: 'temporary outage' }, recorded(),
  ]);
  await assert.rejects(p.processEvent(failed.client, issueEvent('edited')), /temporary outage/);
  assert.equal(failed.state.processed, false);
  const retry = database([...initial(), ...scenarios[0].steps, completed()], failed.state);
  await p.processEvent(retry.client, { ...issueEvent('edited'), existingId: 7 });
  assert.equal(retry.state.processed, true);
  assert.equal(retry.state.error_message, null);
  assert.equal(p.notifications.length, 1);
  failed.assertComplete();
  retry.assertComplete();
});

test('failure recording errors include both the original failure and persistence failure', async () => {
  const db = database([...initial(), existingTask(),
    { ...step('tasks', 'update'), error: 'original outage' },
    { ...recorded(), error: 'error log outage' },
  ]);
  const p = await processor();
  await assert.rejects(p.processEvent(db.client, issueEvent('edited')), (error) => {
    assert.match(error.message, /recording failure for delivery delivery failed: error log outage/);
    assert.match(error.message, /original error: updating task 42 from issue #10 failed: original outage/);
    return true;
  });
  assert.equal(db.state.processed, false);
  db.assertComplete();
});

for (const [name, steps, pattern] of [
  ['project lookup', [{ ...initial()[0], error: 'lookup outage' }], /project lookup failed.*lookup outage/],
  ['integration registration', [initial()[0], { ...initial()[1], error: 'registration outage' }], /upsert failed.*registration outage/],
  ['empty integration result', [initial()[0], { ...initial()[1], data: null }], /upsert failed.*no row returned/],
]) {
  test(`${name} fails explicitly before any task writes`, async () => {
    const db = database(steps);
    const p = await processor();
    await assert.rejects(p.processEvent(db.client, issueEvent('opened')), pattern);
    assert.equal(db.calls.some((q) => q.table === 'tasks'), false);
    db.assertComplete();
  });
}

test('a task upsert with no returned row cannot mark the event processed', async () => {
  const db = database([...initial(), ...scenarios[3].steps.slice(0, 2),
    step('tasks', 'upsert'), recorded(),
  ]);
  const p = await processor();
  await assert.rejects(p.processEvent(db.client, issueEvent('opened')), /task upsert failed.*no row returned/);
  assert.equal(db.state.processed, false);
  db.assertComplete();
});

test('a thrown database exception is also recorded for recovery', async () => {
  const db = database([...initial(), existingTask(),
    { ...step('tasks', 'update'), throws: 'Connection reset' }, recorded(),
  ]);
  const p = await processor();
  await assert.rejects(p.processEvent(db.client, issueEvent('edited')), /Connection reset/);
  assert.equal(db.state.processed, false);
  assert.equal(db.state.error_message, 'Connection reset');
  db.assertComplete();
});

test('notification failures remain best-effort after successful database processing', async () => {
  const db = database([...initial(), ...scenarios[0].steps, completed()]);
  const p = await processor({ notificationFails: true });
  await p.processEvent(db.client, issueEvent('edited'));
  assert.equal(db.state.processed, true);
  assert.equal(db.state.error_message, null);
  assert.equal(p.notifications.length, 1);
  db.assertComplete();
});
