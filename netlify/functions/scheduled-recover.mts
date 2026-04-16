import type { Config } from '@netlify/functions';
import { createHmac } from 'node:crypto';

// netlify scheduled function — pokes the recovery endpoint every 5 minutes
export default async (): Promise<Response> => {
  const baseUrl = process.env.URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  const token = process.env.GITHUB_WEBHOOK_RECOVERY_TOKEN;
  const signingSecret = process.env.GITHUB_WEBHOOK_RECOVERY_SIGNING_SECRET;

  if (!baseUrl || !token || !signingSecret) {
    console.error('scheduled-recover: missing required env vars');
    return new Response('missing env', { status: 500 });
  }

  const ts = Date.now().toString();
  const signature = createHmac('sha256', signingSecret).update(`ts=${ts}`).digest('hex');

  const res = await fetch(`${baseUrl}/api/github/webhook/recover`, {
    method: 'POST',
    headers: {
      'x-recovery-token': token,
      'x-recovery-ts': ts,
      'x-recovery-signature': signature,
    },
  });

  const body = await res.text();
  console.log(`scheduled-recover: ${res.status} ${body}`);

  return new Response('ok');
};

export const config: Config = {
  schedule: '*/5 * * * *',
};
