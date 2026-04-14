"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Megaphone, 
  FileText, 
  Bookmark, 
  Users, 
  Handshake, 
  Receipt, 
  Zap, 
  Settings, 
  Bell, 
  HelpCircle, 
  CreditCard, 
  LogOut,
  ChevronDown,
  Search,
  Plus
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/dashboard/campaigns', label: 'Campaigns', icon: Megaphone, hasSub: true },
    { href: '/dashboard/reports', label: 'Reports', icon: FileText, hasSub: true },
    { href: '/dashboard/saved-reports', label: 'Saved Reports', icon: Bookmark, hasSub: true },
    { href: '/dashboard/publishers', label: 'Publishers', icon: Users, hasSub: true },
    { 
      href: '/dashboard/advertisers/manage', 
      label: 'Advertisers', 
      icon: Handshake, 
      hasSub: true,
      subItems: [
        { label: 'Manage', href: '/dashboard/advertisers/manage' },
        { label: 'Postbacks Hits Received', href: '/dashboard/advertisers/postback-hits' }
      ]
    },
    { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt, hasSub: true },
    { href: '/dashboard/automation', label: 'Automation', icon: Zap, hasSub: true },
    { href: '/dashboard/customize', label: 'Customize', icon: Settings },
    { href: '/dashboard/notifications', label: 'Notification', icon: Bell },
    { href: '/dashboard/support', label: 'Support', icon: HelpCircle },
    { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900 }}>A</div>
          <span style={{ fontSize: '1.25rem', color: 'white' }}>Admagic</span>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div key={item.label}>
              <Link 
                href={item.href} 
                className={`nav-item ${pathname === item.href ? 'active' : ''}`}
              >
                <item.icon size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.hasSub && <ChevronDown size={14} style={{ opacity: 0.5 }} />}
              </Link>
              
              {/* Conditional sub-menu for Advertisers (as in screenshot) */}
              {item.label === 'Advertisers' && pathname.includes('advertisers') && (
                <div style={{ background: 'rgba(0,0,0,0.1)', padding: '0.25rem 0' }}>
                  {item.subItems?.map(sub => (
                    <Link 
                      key={sub.label}
                      href={sub.href}
                      className="nav-item"
                      style={{ paddingLeft: '3.25rem', fontSize: '0.8rem', opacity: 0.8 }}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} className="nav-item" style={{ width: '100%', border: 'none', background: 'transparent' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Dashboard</h2>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{ paddingLeft: '2.5rem', height: '36px', background: '#f8f9fa', borderRadius: '4px' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button className="btn-actions">
              <span>Actions</span>
              <ChevronDown size={14} />
            </button>
            <Search size={20} style={{ color: '#666' }} />
            <Bell size={20} style={{ color: '#666' }} />
            <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>AD</div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
