// /app/layout.js
import './globals.css'; // Assuming you have this for global styles
import SessionProviderWrapper from '../components/SessionProviderWrapper';
// import { getServerSession } from "next-auth/next" // If you need session on the server for initial render
// import { authOptions } from "../lib/authOptions"   // If you need session on the server

export const metadata = {
  title: 'Admin Panel',
  description: 'E-commerce Admin Panel',
};

export default async function RootLayout({ children }) {
  // const session = await getServerSession(authOptions) // Optional: get session on server
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper /* session={session} */ > {/* Pass session if fetched on server */}
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}