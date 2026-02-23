import MembershipPortalSidebar from "@/components/portal/project/MembershipPortalSidebar";
import { createClient } from "@/lib/supabase/server";

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { projectId } = await params;

  let projectName: string | undefined;
  let logoUrl: string | undefined;
  if (projectId) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('projects')
      .select('projectName, logoUrl')
      .eq('id', projectId)
      .single();
    projectName = data?.projectName ?? undefined;
    logoUrl = data?.logoUrl ?? undefined;
  }

  return (
    <div className="flex flex-1 text-black">
      <MembershipPortalSidebar className="flex-shrink-0" projectName={projectName} logoUrl={logoUrl} />
      <div className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
