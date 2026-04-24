import { cookies } from 'next/headers'
import {
  UIStateProvider,
  SIDEBAR_COLLAPSED_COOKIE,
  ACTIVITY_HIDDEN_COOKIE,
} from '@/components/portal/ui/UIStateProvider'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies()
  const sidebarCollapsed = cookieStore.get(SIDEBAR_COLLAPSED_COOKIE)?.value === '1'
  const activityHidden = cookieStore.get(ACTIVITY_HIDDEN_COOKIE)?.value === '1'

  return (
    <UIStateProvider
      initialSidebarCollapsed={sidebarCollapsed}
      initialActivityHidden={activityHidden}
    >
      <div className="font-[family-name:var(--font-inter)] min-h-screen">
        {children}
      </div>
    </UIStateProvider>
  );
}
