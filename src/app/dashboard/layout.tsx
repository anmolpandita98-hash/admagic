"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
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
  ChevronRight,
  Search,
  Plus,
  UserPlus,
  Upload,
  Download,
  Rocket
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [actionsOpen, setActionsOpen] = useState(false);
  const [expandedSidebar, setExpandedSidebar] = useState<string | null>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) setActionsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/dashboard/campaigns', label: 'Campaigns', icon: Megaphone, hasSub: true,
      subItems: [
        { label: 'Manage Campaigns', href: '/dashboard/campaigns' },
        { label: 'Create Campaign', href: '/dashboard/campaigns/new' },
      ]
    },
    { href: '/dashboard/reports', label: 'Reports', icon: FileText, hasSub: true,
      subItems: [
        { label: 'Campaign Reports', href: '/dashboard/reports' },
        { label: 'Publisher Reports', href: '/dashboard/reports?view=publisher' },
      ]
    },
    { href: '/dashboard/saved-reports', label: 'Saved Reports', icon: Bookmark },
    { href: '/dashboard/publishers', label: 'Publishers', icon: Users, hasSub: true,
      subItems: [
        { label: 'Manage Publishers', href: '/dashboard/publishers' },
      ]
    },
    { href: '/dashboard/advertisers/manage', label: 'Advertisers', icon: Handshake, hasSub: true,
      subItems: [
        { label: 'Manage', href: '/dashboard/advertisers/manage' },
        { label: 'Postback Hits', href: '/dashboard/advertisers/manage?view=postbacks' },
      ]
    },
    { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt },
    { href: '/dashboard/automation', label: 'Automation', icon: Zap },
    { href: '/dashboard/customize', label: 'Customize', icon: Settings },
    { href: '/dashboard/notifications', label: 'Notification', icon: Bell },
    { href: '/dashboard/support', label: 'Support', icon: HelpCircle },
    { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  ];

  // Header Actions dropdown items
  const headerActions = [
    { icon: <Megaphone size={14} />, label: 'Create Campaign', href: '/dashboard/campaigns/new' },
    { icon: <UserPlus size={14} />, label: 'Add Advertiser', href: '/dashboard/advertisers/manage?action=add' },
    { icon: <UserPlus size={14} />, label: 'Add Publisher', href: '/dashboard/publishers?action=add' },
    null, // divider
    { icon: <Upload size={14} />, label: 'Bulk Import (CSV)', action: () => alert('CSV Bulk Import — Coming Soon') },
    { icon: <Download size={14} />, label: 'Export Data', action: () => alert('Exporting data...') },
    null,
    { icon: <Rocket size={14} />, label: 'Fire Test Postback', action: () => alert('Test postback fired!') },
    { icon: <BarChart3 size={14} />, label: 'View Reports', href: '/dashboard/reports' },
  ];

  // Which sections are active
  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  function toggleSidebarExpand(label: string) {
    setExpandedSidebar(prev => prev === label ? null : label);
  }

  // Derive current page title
  const currentPage = navItems.find(n => isActive(n.href));
  const pageTitle = currentPage?.label || 'Dashboard';

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900 }}>A</div>
          <span style={{ fontSize: '1.25rem', color: 'white' }}>Admagic</span>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const expanded = expandedSidebar === item.label || (item.hasSub && active);
            
            return (
              <div key={item.label}>
                <div
                  className={`nav-item ${active ? 'active' : ''}`}
                  onClick={() => {
                    if (item.hasSub) {
                      toggleSidebarExpand(item.label);
                    }
                    router.push(item.href);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <item.icon size={18} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.hasSub && (
                    <ChevronDown size={14} style={{ opacity: 0.5, transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
                  )}
                </div>
                
                {/* Sub-menu */}
                {item.hasSub && expanded && item.subItems && (
                  <div style={{ background: 'rgba(0,0,0,0.1)', padding: '0.2rem 0', overflow: 'hidden' }}>
                    {item.subItems.map(sub => (
                      <Link 
                        key={sub.label}
                        href={sub.href}
                        className="nav-item"
                        style={{ paddingLeft: '3.25rem', fontSize: '0.78rem', opacity: pathname === sub.href ? 1 : 0.7, fontWeight: pathname === sub.href ? 700 : 400 }}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#333' }}>{pageTitle}</h2>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={15} />
              <input 
                type="text" 
                placeholder="Search campaigns, publishers..." 
                style={{ paddingLeft: '2.25rem', height: '34px', background: '#f8f9fa', borderRadius: '4px', border: '1px solid #e0e6ed', fontSize: '0.8rem', width: '100%' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Actions Dropdown */}
            <div ref={actionsRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setActionsOpen(!actionsOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Actions <ChevronDown size={13} />
              </button>
              {actionsOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: 'white', border: '1px solid #e0e6ed', borderRadius: '6px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', minWidth: '220px', zIndex: 1000, padding: '4px 0' }}>
                  {headerActions.map((item, i) =>
                    item === null ? (
                      <div key={`d-${i}`} style={{ height: 1, background: '#e8ecef', margin: '4px 8px' }} />
                    ) : item.href ? (
                      <Link
                        key={i}
                        href={item.href}
                        onClick={() => setActionsOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1rem', fontSize: '0.82rem', color: '#333', textDecoration: 'none', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f4f7f6')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{ color: 'var(--primary)' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        key={i}
                        onClick={() => { item.action?.(); setActionsOpen(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', padding: '0.5rem 1rem', fontSize: '0.82rem', color: '#333', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f4f7f6')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{ color: 'var(--primary)' }}>{item.icon}</span>
                        {item.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            <Link href="/dashboard/notifications" style={{ color: '#666', display: 'flex' }}>
              <Bell size={20} />
            </Link>
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
