import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isProjectMember } from '@/lib/utils/authorization';
import { fetchIssues, parseGitHubUrl } from '@/lib/services/githubService';

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

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
      .select('github_pat_encrypted, githubUrl')
      .eq('id', projectId)
      .single();

    if (projectError) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.github_pat_encrypted) {
      return NextResponse.json({ error: 'GitHub not connected' }, { status: 400 });
    }

    if (!project.githubUrl) {
      return NextResponse.json({ error: 'No GitHub URL configured' }, { status: 400 });
    }

    const parsed = parseGitHubUrl(project.githubUrl);
    if (!parsed) {
      return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
    }

    const { owner, repo } = parsed;

    const { searchParams } = new URL(request.url);
    const state = (searchParams.get('state') as 'open' | 'closed' | 'all') ?? 'open';
    const perPage = parseInt(searchParams.get('per_page') ?? '30', 10);

    const { data, error } = await fetchIssues(owner, repo, project.github_pat_encrypted, {
      state,
      per_page: Math.min(perPage, 100),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status ?? 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
