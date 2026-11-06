# Slack announcements

The function authenticates database webhooks before allowing Slack delivery
([#278](https://github.com/UCLA-Creative-Labs/sunshine/issues/278)). The changes for
[#282](https://github.com/UCLA-Creative-Labs/sunshine/issues/282) add the intended
high-priority ping and move channel mappings into function secrets. Board and
club-wide announcements may intentionally use the same channel.

## Changes

- Require `x-webhook-secret` to match `SLACK_ANNOUNCEMENT_WEBHOOK_SECRET` before
  parsing the request body or accessing Supabase or Slack. Compare fixed-length
  SHA-256 digests with `timingSafeEqual`.
- Accept only authenticated INSERT webhooks for `public.project_announcements`,
  using `record.id` to reload content and audience with the service-role client.
- Escape Slack control characters in titles and descriptions, disable automatic
  broadcast parsing, and validate optional links before building Slack markup.
- Send `slackDescription` in the message section, with a trusted `<!channel>`
  prefix only for stored announcements with `priority: 'high'`.
- Read board, club-wide, and team channel IDs from Edge Function secrets.
  Project destinations remain in `projects.slack_channel_id`. Missing or invalid
  mappings return 503 without posting; there are no hardcoded channel fallbacks.

There are no frontend changes or schema migrations. Separate board and club-wide
destinations are outside the agreed scope of #282. Both channel secrets can use
`C042EJJE33K`, preserving the existing shared `#general` destination.

## Dashboard preparation

Complete these settings before deploying the updated function:

1. Keep the matching secret/header pair already configured for #278. For a new
   setup, generate a random shared secret, such as 32 random bytes encoded as
   hex, and save it as `SLACK_ANNOUNCEMENT_WEBHOOK_SECRET` in Edge Function secrets.
2. Add `x-webhook-secret` to the existing announcement webhook's HTTP headers,
   with exactly the same value. Keep its existing Content-Type and authentication
   headers. The new value is a separate custom header, not a Bearer token.
3. Preserve the existing gateway JWT verification setting and any Authorization
   header it requires. The shared secret is mandatory regardless of that setting.

Store real secret values in Supabase, not in source control or PR comments.
Deploying without a matching secret and header will stop Slack delivery: an
unconfigured function returns 503, and missing or incorrect caller secrets
return 401. Saving configuration alone does not activate the code change.

The webhook must use POST and INSERT on `public.project_announcements`, targeting
`slack-announcement`. `SLACK_BOT_TOKEN` and the hosted Supabase service credentials
remain required as before.

Before deploying #282, add these channel secrets under **Edge Functions > Secrets**.
These values preserve the destinations from the original function:

| Secret | Value |
| --- | --- |
| `SLACK_BOARD_CHANNEL_ID` | `C042EJJE33K` |
| `SLACK_CLUB_WIDE_CHANNEL_ID` | `C042EJJE33K` |
| `SLACK_TECH_CHANNEL_ID` | `C07GEAH55EX` |
| `SLACK_FINANCE_CHANNEL_ID` | `C07GT3VRNDP` |
| `SLACK_MARKETING_CHANNEL_ID` | `C07GBGY0AH3` |
| `SLACK_DESIGN_CHANNEL_ID` | `C07GT3VMEHF` |
| `SLACK_PROJECT_MANAGERS_CHANNEL_ID` | `C07GBGXEXMK` |

Changing these secret values does not require editing the function's source.
Configure destinations in use before deploying; missing values will stop delivery
for the affected audience with a 503 response. The #278 webhook secret/header
configuration and gateway authentication remain required.

## Local verification

These tests use synthetic secrets, database results, and Slack responses. They
do not connect to the real project or send messages.

From this checkout's root, run:

```sh
node --test supabase/functions/slack-announcement/handler.test.ts
deno test --no-lock --node-modules-dir=none supabase/functions/slack-announcement/handler.test.ts
deno check --no-lock --node-modules-dir=none supabase/functions/slack-announcement/index.ts
deno lint --rules-exclude=no-import-prefix supabase/functions/slack-announcement/*.ts
```

Node requires version 22.18 or newer. The Deno lint exception preserves the
entrypoint's existing URL imports. The app's TypeScript configuration excludes
`supabase`, so the Deno check validates the actual deployed entrypoint separately.
The `Slack announcement security` workflow runs the Deno checks and regression
tests on pull requests that change this function or its workflow. It needs no
Supabase or Slack credentials.

## Deployment and live verification still required

Deploy `slack-announcement` through the team's release process after confirming
the shared-secret configuration. Deploy both `index.ts` and its `handler.ts`
dependency together; copying only `index.ts` into a dashboard editor is insufficient.

After deployment:

1. Send a request with valid gateway authentication but no `x-webhook-secret`;
   expect the handler to return 401 and make no database or Slack calls.
2. Repeat with an incorrect webhook secret; expect the same rejection. Keep the
   gateway JWT valid so a platform-level 401 cannot mask the handler check.
3. Verify an authorized database INSERT reaches the handler and delivers stored
   announcement content to an approved test destination. Use normal priority.
4. Confirm supplied record fields cannot override the stored content or audience,
   and Slack control characters are rendered as text.
5. In an approved test channel, verify a high-priority announcement includes the
   deliberate channel mention and a normal-priority announcement does not.

An authenticated replay of the same stored announcement can still cause duplicate
delivery; persistent deduplication and retries are outside this change.

References: [Database Webhooks](https://supabase.com/docs/guides/database/webhooks),
[Edge Function secrets](https://supabase.com/docs/guides/functions/secrets),
[Authentication headers](https://supabase.com/docs/guides/functions/auth-headers),
[Slack formatting](https://docs.slack.dev/messaging/formatting-message-text/).
