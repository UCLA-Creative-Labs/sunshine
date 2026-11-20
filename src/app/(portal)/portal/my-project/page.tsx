import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function MyProjectPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  const { data: memberships, error: membershipError } = await supabase
    .from('project_members')
    .select('project_id, project:projects!project_members_project_id_fkey(id, projectName)')
    .eq('user_id', user.id);

  if (membershipError) {
    console.error('Failed to load memberships:', membershipError);
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-red-500">
          Couldn&apos;t load your projects. Please refresh and try again.
        </p>
      </div>
    );
  }

  type MemberProject = { id: string; projectName: string };
  const projects = (memberships ?? [])
    .map((m) => m.project as unknown as MemberProject | null)
    .filter((p): p is MemberProject => !!p)
    .sort((a, b) => a.projectName.localeCompare(b.projectName));

  if (projects.length === 1) {
    redirect(`/portal/projects/${projects[0].id}/overview`);
  }

  if (projects.length > 1) {
    return (
      <div className="flex-1 text-black px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Choose a project</h1>
          <ul className="space-y-2">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/portal/projects/${p.id}/overview`}
                  className="block rounded-lg border border-[#D4D7E5] bg-white px-4 py-3 text-sm font-medium text-black hover:bg-gray-50 transition-colors"
                >
                  {p.projectName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="mb-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          You&apos;re Not in a Project Yet
        </h2>
        <p className="text-gray-500 mb-6">
          You haven&apos;t been added to any project. Contact a project lead to get invited to a project.
        </p>
        <Link
          href="/portal/directory"
          className="inline-flex px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Browse Projects
        </Link>
      </div>
    </div>
  );
}
