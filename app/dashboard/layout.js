// /app/dashboard/layout.js
// This can be a Server Component if Sidebar/Header don't need client interactivity directly,
// or a Client Component if they do (e.g. dynamic menus based on client state).
// For simplicity, let's make it a server component and pass session to client components if needed.

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/authOptions"; // Adjust path
import Link from "next/link";
import { redirect } from "next/navigation"; // For server-side redirect if needed (though middleware handles this)
import Sidebar from "../../components/ui/Sidebar"; // Example component
// import Header from "../../components/ui/Header"; // Example component

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    // Middleware should ideally handle this redirect before this component renders.
    // But as a fallback or for direct access attempts:
    redirect('/auth/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar /> {/* Your navigation sidebar component */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* <Header session={session} /> */} {/* Your header component, can show user info/logout */}
        <main style={{ padding: '20px', flexGrow: 1, background: '#f9f9f9' }}>
          {children}
        </main>
      </div>
    </div>
  );
}