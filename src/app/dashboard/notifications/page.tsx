import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Bell, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

const NOTIFICATIONS = [
  { id: 1, type: 'success', icon: <CheckCircle size={16} color="#28a745" />, title: 'Campaign "E-commerce Summer Sale" is now active', time: '2 hours ago', read: false },
  { id: 2, type: 'warning', icon: <AlertTriangle size={16} color="#e67e22" />, title: 'Publisher "Premium Traffic" conversion rate dropped below 1%', time: '5 hours ago', read: false },
  { id: 3, type: 'info', icon: <Info size={16} color="#00a2e8" />, title: 'New advertiser "Global Brands Ltd" registered on the platform', time: '1 day ago', read: true },
  { id: 4, type: 'info', icon: <Info size={16} color="#00a2e8" />, title: 'Monthly invoice #INV-1001 generated for Ace Media', time: '2 days ago', read: true },
  { id: 5, type: 'success', icon: <CheckCircle size={16} color="#28a745" />, title: 'Campaign "Finance App Install" reached 100 conversions milestone', time: '3 days ago', read: true },
  { id: 6, type: 'warning', icon: <AlertTriangle size={16} color="#e67e22" />, title: 'Automation rule "Low CR Alert" triggered for Campaign #42', time: '3 days ago', read: true },
];

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#333' }}>Notifications</h2>
          <span style={{ background: '#dc3545', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>
            {NOTIFICATIONS.filter(n => !n.read).length} new
          </span>
        </div>
        <button style={{ padding: '0.4rem 0.9rem', background: '#eee', color: '#666', border: 'none', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Mark All Read
        </button>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
        {NOTIFICATIONS.map((n, i) => (
          <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 1rem', borderBottom: i < NOTIFICATIONS.length - 1 ? '1px solid #f0f0f0' : 'none', background: n.read ? 'white' : '#f8fbff' }}>
            <div style={{ marginTop: '2px' }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', color: '#333', fontWeight: n.read ? 400 : 600 }}>{n.title}</div>
              <div style={{ fontSize: '0.72rem', color: '#999', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                <Clock size={11} /> {n.time}
              </div>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginTop: '6px' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
