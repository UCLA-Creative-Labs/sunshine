import { redirect } from 'next/navigation';
import { getInternalRoleForUser, hasInternalRole } from '@/lib/internal/permissions';
import InternalSidebar from '@/components/portal/internal/InternalSidebar';

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side access gate (ACC-02): check role before rendering anything
  const userRoles = await getInternalRoleForUser();
  const isInternalUser = hasInternalRole(userRoles);

  if (!isInternalUser) {
    redirect('/portal');
  }

  return (
    <div className="flex flex-1 text-black">
      <InternalSidebar className="flex-shrink-0" />
      <div className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
