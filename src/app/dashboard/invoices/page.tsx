import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Receipt, Download, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const INVOICES = [
  { id: 'INV-1001', publisher: 'Ace Media', amount: 1240.50, status: 'PAID', period: 'Mar 2026', due: '2026-04-05' },
  { id: 'INV-1002', publisher: 'Premium Traffic', amount: 890.00, status: 'PENDING', period: 'Mar 2026', due: '2026-04-12' },
  { id: 'INV-1003', publisher: 'Ace Media', amount: 760.25, status: 'PAID', period: 'Feb 2026', due: '2026-03-05' },
  { id: 'INV-1004', publisher: 'Premium Traffic', amount: 1100.00, status: 'OVERDUE', period: 'Feb 2026', due: '2026-03-10' },
];

const statusStyle: Record<string, { background: string; color: string }> = {
  PAID: { background: '#e3fcef', color: '#006644' },
  PENDING: { background: '#fffadc', color: '#7a5000' },
  OVERDUE: { background: '#ffe9e9', color: '#991b1b' },
};

const statusIcon: Record<string, React.ReactNode> = {
  PAID: <CheckCircle size={12} />,
  PENDING: <Clock size={12} />,
  OVERDUE: <AlertCircle size={12} />,
};

export default async function Invoices() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const totalPaid = INVOICES.filter(i => i.status === 'PAID').reduce((s, i) => s + i.amount, 0);
  const totalPending = INVOICES.filter(i => i.status === 'PENDING').reduce((s, i) => s + i.amount, 0);
  const totalOverdue = INVOICES.filter(i => i.status === 'OVERDUE').reduce((s, i) => s + i.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Receipt size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#333' }}>Invoices</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            <Download size={14} /> Export
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            + Generate Invoice
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        <div style={{ background: 'white', border: '1px solid var(--card-border)', padding: '1rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#006644', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Paid</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#006644' }}>${totalPaid.toFixed(2)}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--card-border)', padding: '1rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7a5000', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Pending</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7a5000' }}>${totalPending.toFixed(2)}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--card-border)', padding: '1rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Overdue</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#991b1b' }}>${totalOverdue.toFixed(2)}</div>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', background: '#f8f9fa', borderBottom: '1px solid var(--card-border)', fontWeight: 700, fontSize: '0.75rem', color: '#666' }}>
          ALL INVOICES
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Publisher</th>
              <th>Period</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {INVOICES.map(inv => (
              <tr key={inv.id}>
                <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{inv.id}</td>
                <td>{inv.publisher}</td>
                <td style={{ color: '#666' }}>{inv.period}</td>
                <td style={{ fontWeight: 700 }}>${inv.amount.toFixed(2)}</td>
                <td style={{ color: '#999', fontSize: '0.8rem' }}>{inv.due}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 700, ...statusStyle[inv.status] }}>
                    {statusIcon[inv.status]} {inv.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button style={{ padding: '0.2rem 0.5rem', background: '#00a2e8', color: 'white', border: 'none', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>View</button>
                    <button style={{ padding: '0.2rem 0.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>PDF</button>
                    {inv.status !== 'PAID' && (
                      <button style={{ padding: '0.2rem 0.5rem', background: '#6f42c1', color: 'white', border: 'none', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>Mark Paid</button>
                    )}
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
