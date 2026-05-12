import { NextRequest, NextResponse } from 'next/server';
import { Webhooks } from '@octokit/webhooks';
import { processEvent } from '@/lib/services/githubWebhookProcessor';
import { getServiceRoleClient } from '@/lib/supabase/serviceRoleClient';

export const runtime = 'nodejs';

let webhooksInstance: Webhooks | null = null;

function getWebhooks(): Webhooks {
  if (webhooksInstance) return webhooksInstance;
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('GITHUB_WEBHOOK_SECRET is not set');
  }
  webhooksInstance = new Webhooks({ secret });
  return webhooksInstance;
}

const SUPPORTED_EVENTS = new Set(['issues', 'pull_request']);

export async function POST(req: NextRequest): Promise<NextResponse> {
  const budgetMs = Number(process.env.GITHUB_WEBHOOK_PROCESSING_BUDGET_MS ?? '8000');
  const signature = req.headers.get('x-hub-signature-256') ?? '';
  const deliveryId = req.headers.get('x-github-delivery') ?? '';
  const eventType = req.headers.get('x-github-event') ?? '';

  if (!signature || !deliveryId || !eventType) {
    return NextResponse.json({ error: 'missing required webhook headers' }, { status: 400 });
  }

  const body = await req.text();

  if (!(await getWebhooks().verify(body, signature))) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  if (!SUPPORTED_EVENTS.has(eventType)) {
    return NextResponse.json({ status: 'ignored_event' }, { status: 202 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'invalid json payload' }, { status: 400 });
  }

  const supabase = getServiceRoleClient();

  const { data: existing } = await supabase
    .from('github_integrations')
    .select('id, processed')
    .eq('delivery_id', deliveryId)
    .maybeSingle();

  const existingRow = existing as { id: number; processed: boolean } | null;
  if (existingRow?.processed) {
    return NextResponse.json({ status: 'already_processed' });
  }

  try {
    const outcome = await Promise.race([
      processEvent(supabase, {
        deliveryId,
        eventType,
        payload,
        existingId: existingRow?.id,
      }).then(() => 'ok' as const),
      new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), budgetMs)),
    ]);

    if (outcome === 'timeout') {
      // ack within github's ~10s budget; recovery picks it up later
      return NextResponse.json({ status: 'accepted_for_recovery' }, { status: 202 });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error(`webhook processing failed [${deliveryId}]:`, err);
    return NextResponse.json({ status: 'accepted_for_recovery' }, { status: 202 });
  }
}
