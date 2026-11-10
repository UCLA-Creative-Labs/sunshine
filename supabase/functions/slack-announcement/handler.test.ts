import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createAnnouncementHandler } from './handler.ts';
import type { Announcement } from './handler.ts';

function setup(overrides: Partial<Announcement> = {}, envOverrides: Record<string, string> = {}) {
  const env: Record<string, string> = {
    SLACK_ANNOUNCEMENT_WEBHOOK_SECRET: 'test-secret-é',
    SLACK_BOT_TOKEN: 'test-token',
    SLACK_CLUB_WIDE_CHANNEL_ID: 'CCLUB',
    SLACK_BOARD_CHANNEL_ID: 'CBOARD',
    SLACK_TECH_CHANNEL_ID: 'CTECH',
    ...envOverrides,
  };
  const announcement: Announcement = {
    title: 'Update', description: 'Details', visibility: 'club_wide',
    priority: 'normal', project_id: null, target_team: null, link_url: null,
    ...overrides,
  };
  const calls = { announcements: [] as string[], projects: [] as string[], slack: [] as Record<string, unknown>[] };
  const deps = {
    env: (key: string) => env[key],
    getAnnouncement: (id: string): Promise<Announcement | null> => {
      calls.announcements.push(id);
      return Promise.resolve(announcement);
    },
    getProjectChannel: (id: string): Promise<string | null> => {
      calls.projects.push(id);
      return Promise.resolve('CPROJECT');
    },
    fetch: ((url: string | URL | Request, init?: RequestInit) => {
      assert.equal(url, 'https://slack.com/api/chat.postMessage');
      assert.equal((init?.headers as Record<string, string>).Authorization, 'Bearer test-token');
      calls.slack.push(JSON.parse(init?.body as string));
      return Promise.resolve(Response.json({ ok: true }));
    }) as typeof fetch,
  };
  const handler = createAnnouncementHandler(deps);
  const payload = {
    type: 'INSERT', schema: 'public', table: 'project_announcements',
    record: { id: 'announcement-id' },
  };
  const request = (body: unknown = payload, secret: string | null = env.SLACK_ANNOUNCEMENT_WEBHOOK_SECRET) =>
    new Request('https://example.com', {
      method: 'POST', headers: secret === null ? {} : { 'x-webhook-secret': secret },
      body: JSON.stringify(body),
    });
  return { handler, request, payload, announcement, calls, deps };
}

for (const secret of [null, 'wrong', 'test-secret-', 'test-secret-è', 'test-secret-é-extra', '']) {
  test(`rejects invalid secret ${JSON.stringify(secret)} before database or Slack access`, async () => {
    const s = setup();
    assert.equal((await s.handler(s.request(undefined, secret))).status, 401);
    assert.deepEqual(s.calls, { announcements: [], projects: [], slack: [] });
  });
}

test('the existing Authorization header does not replace the webhook secret', async () => {
  const s = setup();
  const req = s.request(undefined, null);
  req.headers.set('Authorization', 'Bearer project-token');
  assert.equal((await s.handler(req)).status, 401);
  assert.deepEqual(s.calls, { announcements: [], projects: [], slack: [] });
});

test('missing server secret fails closed', async () => {
  const s = setup({}, { SLACK_ANNOUNCEMENT_WEBHOOK_SECRET: '' });
  assert.equal((await s.handler(s.request(undefined, 'anything'))).status, 503);
  assert.equal(s.calls.announcements.length, 0);
});

test('accepts only POST', async () => {
  const s = setup();
  const res = await s.handler(new Request('https://example.com'));
  assert.equal(res.status, 405);
  assert.equal(res.headers.get('Allow'), 'POST');
});

test('unauthenticated malformed JSON is rejected before reading the body', async () => {
  const s = setup();
  const req = s.request(undefined, 'wrong');
  assert.equal((await s.handler(new Request(req.url, {
    method: 'POST', headers: req.headers, body: '{',
  }))).status, 401);
  assert.deepEqual(s.calls, { announcements: [], projects: [], slack: [] });
});

test('malformed JSON returns 400 after authentication', async () => {
  const s = setup();
  const req = s.request();
  assert.equal((await s.handler(new Request(req.url, { method: 'POST', headers: req.headers, body: '{' }))).status, 400);
  assert.equal(s.calls.announcements.length, 0);
});

for (const payload of [null, [], 'not an object', {}, { type: 'unknown' }, { type: 'INSERT' },
  { type: 'INSERT', schema: 'public', table: 'other', record: { id: 'x' } },
  { type: 'INSERT', schema: 'private', table: 'project_announcements', record: { id: 'x' } },
  { type: 'INSERT', schema: 'public', table: 'project_announcements', record: [] },
  { type: 'INSERT', schema: 'public', table: 'project_announcements', record: { id: {} } },
  { type: 'INSERT', schema: 'public', table: 'project_announcements', record: { id: '  ' } }]) {
  test(`invalid or irrelevant payload cannot post: ${JSON.stringify(payload)}`, async () => {
    const s = setup();
    assert.equal((await s.handler(s.request(payload))).status, 400);
    assert.equal(s.calls.announcements.length, 0);
    assert.equal(s.calls.slack.length, 0);
  });
}

test('ignores non-insert events', async () => {
  for (const type of ['UPDATE', 'DELETE']) {
    const s = setup();
    assert.equal((await s.handler(s.request({ ...s.payload, type }))).status, 200);
    assert.deepEqual(s.calls, { announcements: [], projects: [], slack: [] });
  }
});

test('uses stored announcement content, priority and audience, ignoring forged record fields', async () => {
  const s = setup({ visibility: 'board' });
  const res = await s.handler(s.request({ ...s.payload,
    record: { id: 'announcement-id', title: 'FORGED', description: '<!channel>', priority: 'high', visibility: 'club_wide' },
  }));
  assert.equal(res.status, 200);
  assert.deepEqual(s.calls.announcements, ['announcement-id']);
  assert.equal(s.calls.slack[0].channel, 'CBOARD');
  assert.equal(JSON.stringify(s.calls.slack[0]).includes('FORGED'), false);
  assert.equal(JSON.stringify(s.calls.slack[0]).includes('<!channel>'), false);
});

test('escapes title and description while adding only the trusted high-priority ping', async () => {
  const s = setup({ title: 'A & <B>', description: '<!channel> & <@U123>', priority: 'high' });
  assert.equal((await s.handler(s.request())).status, 200);
  const message = s.calls.slack[0];
  const blocks = message.blocks as { text: { text: string; verbatim?: boolean } }[];
  assert.equal(blocks[0].text.text, '📢 A & <B>');
  assert.equal(blocks[1].text.text, '<!channel>\n&lt;!channel&gt; &amp; &lt;@U123&gt;');
  assert.equal(blocks[1].text.verbatim, true);
  assert.equal(message.text, 'New Announcement: A &amp; &lt;B&gt;');
});

test('normal announcements escape injected pings without adding a ping', async () => {
  const s = setup({ description: '<!channel> & <everyone>' });
  await s.handler(s.request());
  assert.equal(JSON.stringify(s.calls.slack[0]).includes('<!channel>'), false);
});

test('plain-text broadcast names cannot become automatic mentions', async () => {
  const s = setup({ title: '@here', description: '@here @channel @everyone #general' });
  await s.handler(s.request());
  const message = s.calls.slack[0];
  const blocks = message.blocks as { text: { text: string; verbatim?: boolean } }[];
  assert.equal(blocks[1].text.verbatim, true);
  assert.equal(blocks[1].text.text, '@here @channel @everyone #general');
  assert.equal(Object.hasOwn(message, 'link_names'), false);
  assert.equal(JSON.stringify(message).includes('<!channel>'), false);
});

test('routes team and project announcements using configured and stored channels', async () => {
  for (const visibility of ['team', 'project']) {
    const s = setup({ visibility, target_team: 'tech', project_id: 'project-id' });
    assert.equal((await s.handler(s.request())).status, 200);
    assert.equal(s.calls.slack[0].channel, visibility === 'team' ? 'CTECH' : 'CPROJECT');
    assert.deepEqual(s.calls.projects, visibility === 'project' ? ['project-id'] : []);
  }
});

test('missing board channel fails closed', async () => {
  const s = setup({ visibility: 'board' }, { SLACK_BOARD_CHANNEL_ID: '' });
  assert.equal((await s.handler(s.request())).status, 503);
  assert.equal(s.calls.slack.length, 0);
});

test('board and club-wide announcements can intentionally share a channel', async () => {
  const env = { SLACK_BOARD_CHANNEL_ID: 'C042EJJE33K', SLACK_CLUB_WIDE_CHANNEL_ID: 'C042EJJE33K' };
  for (const visibility of ['board', 'club_wide']) {
    const s = setup({ visibility }, env);
    assert.equal((await s.handler(s.request())).status, 200);
    assert.equal(s.calls.slack[0].channel, 'C042EJJE33K');
  }
});

test('each board team uses its configured channel secret', async () => {
  const teams = {
    tech: 'SLACK_TECH_CHANNEL_ID',
    finance: 'SLACK_FINANCE_CHANNEL_ID',
    marketing: 'SLACK_MARKETING_CHANNEL_ID',
    design: 'SLACK_DESIGN_CHANNEL_ID',
    project_managers: 'SLACK_PROJECT_MANAGERS_CHANNEL_ID',
  };
  for (const [target_team, secret] of Object.entries(teams)) {
    const s = setup({ visibility: 'team', target_team }, { [secret]: 'CDESTINATION' });
    assert.equal((await s.handler(s.request())).status, 200);
    assert.equal(s.calls.slack[0].channel, 'CDESTINATION');
  }
});

test('board delivery works with its confirmed ID while an unconfigured club-wide audience cannot post', async () => {
  const env = { SLACK_BOARD_CHANNEL_ID: 'C042EJJE33K', SLACK_CLUB_WIDE_CHANNEL_ID: '' };
  const board = setup({ visibility: 'board' }, env);
  assert.equal((await board.handler(board.request())).status, 200);
  assert.equal(board.calls.slack[0].channel, env.SLACK_BOARD_CHANNEL_ID);

  const club = setup({ visibility: 'club_wide' }, env);
  assert.equal((await club.handler(club.request())).status, 503);
  assert.equal(club.calls.slack.length, 0);
});

test('missing, invalid and unknown audience channels never fall back to club-wide', async () => {
  for (const overrides of [
    { visibility: 'unknown' }, { visibility: 'toString' }, { visibility: 'team', target_team: 'toString' },
    { visibility: 'team', target_team: 'finance' },
  ]) {
    const s = setup(overrides);
    assert.equal((await s.handler(s.request())).status, 503);
    assert.equal(s.calls.slack.length, 0);
  }
  const s = setup({}, { SLACK_CLUB_WIDE_CHANNEL_ID: '<!channel>' });
  assert.equal((await s.handler(s.request())).status, 503);
  assert.equal(s.calls.slack.length, 0);
});

test('projects without a Slack channel are skipped with 200, not reported as server errors', async () => {
  const s = setup({ visibility: 'project' });
  assert.deepEqual(await (await s.handler(s.request())).json(), { error: 'No channel mapping' });
  assert.equal(s.calls.slack.length, 0);
});

test('channel secrets pasted with surrounding whitespace still deliver', async () => {
  const s = setup({ visibility: 'team', target_team: 'tech' }, { SLACK_TECH_CHANNEL_ID: ' CTECH\n' });
  assert.equal((await s.handler(s.request())).status, 200);
  assert.equal(s.calls.slack[0].channel, 'CTECH');
});

test('missing database row, query failures and missing project channel cannot post', async () => {
  const s = setup();
  s.deps.getAnnouncement = () => Promise.resolve(null);
  assert.equal((await s.handler(s.request())).status, 404);
  s.deps.getAnnouncement = () => Promise.reject(new Error('database unavailable'));
  assert.equal((await s.handler(s.request())).status, 500);
  assert.equal(s.calls.slack.length, 0);
  const p = setup({ visibility: 'project', project_id: 'project-id' });
  p.deps.getProjectChannel = () => Promise.resolve(null);
  assert.equal((await p.handler(p.request())).status, 200);
  assert.equal(p.calls.slack.length, 0);
});

test('missing bot token fails before database or Slack access', async () => {
  const s = setup({}, { SLACK_BOT_TOKEN: '' });
  assert.equal((await s.handler(s.request())).status, 503);
  assert.deepEqual(s.calls, { announcements: [], projects: [], slack: [] });
});

test('long titles and descriptions stay within Slack block limits after escaping', async () => {
  const s = setup({ title: '&'.repeat(200), description: 'x' + '&'.repeat(1000) });
  assert.equal((await s.handler(s.request())).status, 200);
  const blocks = s.calls.slack[0].blocks as { text: { text: string } }[];
  assert.equal(blocks[0].text.text.length, 150);
  assert.ok(blocks[0].text.text.endsWith('&…'));
  assert.ok(blocks[1].text.text.length <= 3000);
  // The cut must not leave a partial entity like "&am" before the ellipsis.
  assert.match(blocks[1].text.text, /^x(&amp;)+…$/);
});

test('short text is not truncated', async () => {
  const s = setup({ title: 'a'.repeat(147), description: 'b'.repeat(3000) });
  await s.handler(s.request());
  const blocks = s.calls.slack[0].blocks as { text: { text: string } }[];
  assert.equal(blocks[0].text.text, `📢 ${'a'.repeat(147)}`);
  assert.equal(blocks[1].text.text, 'b'.repeat(3000));
});

test('stored project channel IDs are trimmed; non-channel values are skipped and logged', async () => {
  const p = setup({ visibility: 'project', project_id: 'project-id' });
  p.deps.getProjectChannel = () => Promise.resolve(' CPROJECT\n');
  assert.equal((await p.handler(p.request())).status, 200);
  assert.equal(p.calls.slack[0].channel, 'CPROJECT');

  const warn = console.warn;
  const warnings: unknown[][] = [];
  console.warn = (...args: unknown[]) => { warnings.push(args); };
  try {
    for (const channel of ['#proj-alpha', 'U123ABC']) {
      const s = setup({ visibility: 'project', project_id: 'project-id' });
      s.deps.getProjectChannel = () => Promise.resolve(channel);
      assert.deepEqual(await (await s.handler(s.request())).json(), { error: 'No channel mapping' });
      assert.equal(s.calls.slack.length, 0);
    }
  } finally {
    console.warn = warn;
  }
  assert.equal(warnings.length, 2);
  assert.ok(String(warnings[0][0]).includes('project=project-id'));
});

test('safe links render and unsafe link markup cannot inject Slack mentions', async () => {
  for (const link_url of ['javascript:alert(1)', 'https://example.com/> <!channel>|x', 'invalid']) {
    const s = setup({ link_url });
    assert.equal((await s.handler(s.request())).status, 200);
    assert.equal(JSON.stringify(s.calls.slack[0]).includes('<!channel>'), false);
  }
  const s = setup({ link_url: 'https://example.com/?a=1&b=2' });
  await s.handler(s.request());
  const blocks = s.calls.slack[0].blocks as { text: { text: string; verbatim?: boolean } }[];
  assert.equal(blocks[2].text.text, '<https://example.com/?a=1&amp;b=2|View more details>');
  assert.equal(blocks[2].text.verbatim, true);
});

test('Slack API, HTTP and network errors do not report success or leak details', async () => {
  const s = setup();
  for (const response of [Response.json({ ok: false, error: 'private-detail' }),
    Response.json({ ok: true }, { status: 500 })]) {
    s.deps.fetch = () => Promise.resolve(response);
    const res = await s.handler(s.request());
    assert.equal(res.status, 502);
    assert.equal((await res.text()).includes('private-detail'), false);
  }
  s.deps.fetch = () => Promise.reject(new Error('private-detail'));
  const res = await s.handler(s.request());
  assert.equal(res.status, 500);
  assert.equal((await res.text()).includes('private-detail'), false);
});
