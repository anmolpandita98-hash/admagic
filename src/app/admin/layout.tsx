import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2 className="logo-text">Admagic Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin" className="nav-item">
            Platform Overview
          </Link>
          <Link href="/admin/tenants" className="nav-item">
            Tenants / Agencies
          </Link>
          <Link href="/dashboard" className="nav-item">
             Switch to Personal
          </Link>
        </nav>
        <div className="sidebar-footer">
          <Link href="/api/auth/logout" className="nav-item logout">
            Logout
          </Link>
        </div>
      </aside>
      <main className="content">
        {children}
      </main>
    </div>
  );
}
