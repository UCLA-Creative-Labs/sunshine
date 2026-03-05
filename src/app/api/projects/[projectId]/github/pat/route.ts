import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encryptPAT } from '@/lib/utils/encryption';
import { isProjectLead, isProjectMember } from '@/lib/utils/authorization';
import { validateGitHubPAT } from '@/lib/services/githubService';

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

/**
 * GET - Check if PAT is configured (returns only status, not the token)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const memberCheck = await isProjectMember(user.id, projectId);
    if (!memberCheck) {
      return NextResponse.json({ error: 'Not a project member' }, { status: 403 });
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('github_pat_encrypted, github_pat_updated_at, githubUrl')
      .eq('id', projectId)
      .single();

    if (projectError) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({
      hasPAT: !!project?.github_pat_encrypted,
      updatedAt: project?.github_pat_updated_at ?? null,
      githubUrl: project?.githubUrl ?? null,
    });
  } catch (error) {
    console.error('Error checking PAT status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST - Save or update the PAT
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leadCheck = await isProjectLead(user.id, projectId);
    if (!leadCheck) {
      return NextResponse.json({ error: 'Only project leads can configure GitHub integration' }, { status: 403 });
    }

    const body = await request.json();
    const { pat } = body;

    if (!pat || typeof pat !== 'string') {
      return NextResponse.json({ error: 'PAT is required' }, { status: 400 });
    }

    const validation = await validateGitHubPAT(pat);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error ?? 'Invalid PAT' }, { status: 400 });
    }

    const encryptedPAT = encryptPAT(pat);

    const { error: updateError } = await supabase
      .from('projects')
      .update({
        github_pat_encrypted: encryptedPAT,
        github_pat_updated_at: new Date().toISOString(),
      })
      .eq('id', projectId);

    if (updateError) {
      console.error('Error saving PAT:', updateError);
      return NextResponse.json({ error: 'Failed to save PAT' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'GitHub token saved successfully' });
  } catch (error) {
    console.error('Error saving PAT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE - Remove the PAT
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leadCheck = await isProjectLead(user.id, projectId);
    if (!leadCheck) {
      return NextResponse.json({ error: 'Only project leads can remove GitHub integration' }, { status: 403 });
    }

    const { error: updateError } = await supabase
      .from('projects')
      .update({
        github_pat_encrypted: null,
        github_pat_updated_at: null,
      })
      .eq('id', projectId);

    if (updateError) {
      console.error('Error removing PAT:', updateError);
      return NextResponse.json({ error: 'Failed to remove PAT' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'GitHub token removed' });
  } catch (error) {
    console.error('Error removing PAT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
