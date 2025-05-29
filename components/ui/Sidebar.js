// /components/ui/Sidebar.js
'use client'; // If it has interactive elements or uses client hooks for logout
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/orders', label: 'Manage Orders' },
    // { href: '/dashboard/products', label: 'Manage Products' },
  ];

  return (
    <aside style={{ width: '250px', background: '#333', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '30px', textAlign: 'center' }}>Admin Panel</h2>
      <nav style={{ flexGrow: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {navItems.map(item => (
            <li key={item.href} style={{ marginBottom: '15px' }}>
              <Link href={item.href} style={{
                color: pathname === item.href ? '#00aaff' : 'white',
                textDecoration: 'none',
                fontSize: '1.1rem',
                display: 'block',
                padding: '10px',
                borderRadius: '4px',
                background: pathname === item.href ? '#444' : 'transparent',
              }}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {session?.user && (
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #555' }}>
          <p style={{ marginBottom: '10px', textAlign: 'center' }}>Welcome, {session.user.name || session.user.email}</p>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            style={{ width: '100%', padding: '10px', background: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}