"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/offers', label: 'Offers / Campaigns' },
    { href: '/dashboard/affiliates', label: 'Affiliates' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid var(--card-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ paddingBottom: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--card-border)' }}>
          <h1 className="ui-logo" style={{ fontSize: '1.25rem' }}>Ad<span>magic</span></h1>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: pathname === link.href ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: pathname === link.href ? 'var(--primary)' : 'var(--foreground)',
                fontWeight: pathname === link.href ? 600 : 400,
                transition: 'all 0.2s ease'
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} className="ui-btn ui-btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>
          Logout
        </button>
      </aside>

      <main style={{ flex: 1, padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}
