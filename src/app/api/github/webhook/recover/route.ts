import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { processEvent } from '@/lib/services/githubWebhookProcessor';
import { getServiceRoleClient } from '@/lib/supabase/serviceRoleClient';

export const runtime = 'nodejs';

const RECOVERY_BATCH_SIZE = 50;

function timingSafeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function verifyRecoverySignature(ts: string, sig: string): boolean {
  const maxAge = Number(process.env.WEBHOOK_RECOVERY_MAX_AGE_SECONDS ?? '300');
  const timestamp = Number(ts);
  if (!Number.isFinite(timestamp)) return false;
  const age = Math.abs(Date.now() - timestamp);
  if (age > maxAge * 1000) return false;

  const secret = process.env.GITHUB_WEBHOOK_RECOVERY_SIGNING_SECRET;
  if (!secret) return false;

  const expected = createHmac('sha256', secret).update(`ts=${ts}`).digest('hex');
  return timingSafeEq(expected, sig);
}

interface FailedRow {
  id: number;
  delivery_id: string;
  event_type: string;
  payload: Record<string, unknown>;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = req.headers.get('x-recovery-token') ?? '';
  const ts = req.headers.get('x-recovery-ts') ?? '';
  const sig = req.headers.get('x-recovery-signature') ?? '';

  const expectedToken = process.env.GITHUB_WEBHOOK_RECOVERY_TOKEN;
  if (!expectedToken || !timingSafeEq(expectedToken, token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (!verifyRecoverySignature(ts, sig)) {
    return NextResponse.json({ error: 'invalid recovery signature' }, { status: 401 });
  }

  const supabase = getServiceRoleClient();

  const { data } = await supabase
    .from('github_integrations')
    .select('id, delivery_id, event_type, payload')
    .eq('processed', false)
    .order('created_at', { ascending: true })
    .limit(RECOVERY_BATCH_SIZE);

  const rows = (data as FailedRow[] | null) ?? [];

  let recovered = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      await processEvent(supabase, {
        deliveryId: row.delivery_id,
        eventType: row.event_type,
        payload: row.payload,
        existingId: row.id,
      });
      recovered++;
    } catch (err) {
      failed++;
      console.error(`recovery failed [${row.delivery_id}]`, err);
    }
  }

  return NextResponse.json({ scanned: rows.length, recovered, failed });
}
