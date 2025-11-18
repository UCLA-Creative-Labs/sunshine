import { redirect } from 'next/navigation';

// This layout wraps all portal pages and handles authentication
// TODO: Add authentication check here
export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // TODO: Check if user is authenticated
    // If not authenticated, redirect to /login
    // const session = await getServerSession()
    // if (!session) {
    //   redirect('/login')
    // }

    return <>{children}</>;
}
