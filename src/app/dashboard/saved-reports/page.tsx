import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Bookmark, BarChart3, Download, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Sample saved reports (in production these would come from DB)
const SAMPLE_SAVED = [
  { id: '1', name: 'Weekly Publisher Performance', type: 'Publisher Report', createdAt: '2026-04-07', schedule: 'Every Monday', columns: 'Clicks, Conversions, Payout, CR%' },
  { id: '2', name: 'Monthly Revenue Summary', type: 'Campaign Report', createdAt: '2026-04-01', schedule: 'Monthly', columns: 'Revenue, Profit, EPC' },
  { id: '3', name: 'Daily Conversion Tracker', type: 'Conversion Report', createdAt: '2026-04-10', schedule: 'Daily 8am', columns: 'Conversions, Revenue, Payout' },
];

export default async function SavedReports() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bookmark size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#333' }}>Saved Reports</h2>
        </div>
        <a href="/dashboard/reports" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', background: 'var(--primary)', color: 'white', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
          <BarChart3 size={14} /> + Create New Report
        </a>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', background: '#f8f9fa', borderBottom: '1px solid var(--card-border)', fontWeight: 700, fontSize: '0.75rem', color: '#666' }}>
          SAVED REPORTS — {SAMPLE_SAVED.length} REPORTS
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Type</th>
              <th>Columns</th>
              <th>Schedule</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_SAVED.map(report => (
              <tr key={report.id}>
                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{report.name}</td>
                <td><span style={{ background: '#e1f5fe', color: '#0288d1', padding: '0.15rem 0.5rem', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 700 }}>{report.type}</span></td>
                <td style={{ fontSize: '0.8rem', color: '#666' }}>{report.columns}</td>
                <td style={{ fontSize: '0.8rem' }}>{report.schedule}</td>
                <td style={{ fontSize: '0.8rem', color: '#999' }}>{report.createdAt}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a href="/dashboard/reports" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.5rem', background: '#00a2e8', color: 'white', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}>
                      <BarChart3 size={11} /> Run
                    </a>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                      <Download size={11} /> Export
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.5rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
