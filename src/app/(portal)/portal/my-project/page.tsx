import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function MyProjectPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  const { data: membership, error: membershipError } = await supabase
    .from('project_members')
    .select('project_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (!membershipError && membership?.project_id) {
    redirect(`/portal/projects/${membership.project_id}/overview`);
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
