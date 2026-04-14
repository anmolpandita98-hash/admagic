import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { 
  Plus, 
  ChevronDown,
  Filter,
  Download,
  Info
} from 'lucide-react';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function ManageAdvertisers({ searchParams }: { searchParams: any }) {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const { q, status } = await searchParams;

  const advertisers = await prisma.advertiser.findMany({
    where: {
      tenantId: session.tenantId,
      OR: q ? [
        { name: { contains: q } },
        { company: { contains: q } },
        { email: { contains: q } }
      ] : undefined,
      status: status || undefined
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex flex-col gap-4">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#444' }}>Manage Advertisers</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
             <button className="btn-actions">
              <span>Actions</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="ui-card p-0 overflow-hidden">
        <div className="p-4" style={{ borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8f9fa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: '#666' }}>
            <span>{advertisers.length} Advertisers</span>
            <button className="btn-primary" style={{ padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}><Plus size={12} /> Add New</button>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', color: '#999' }}>
            <Download size={18} />
            <Info size={18} />
            <Filter size={18} />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}><input type="checkbox" /></th>
              <th>ID</th>
              <th>Name</th>
              <th>Company</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Last Login</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {advertisers.map((adv) => (
              <tr key={adv.id}>
                <td><input type="checkbox" /></td>
                <td style={{ color: '#999' }}>{adv.id.slice(-5)}</td>
                <td>
                  <div className="flex flex-col">
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{adv.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#999' }}>{adv.email}</span>
                  </div>
                </td>
                <td>{adv.company || 'N/A'}</td>
                <td>
                  <span className={`ui-badge ${adv.status === 'ACTIVE' ? 'badge-active' : 'badge-pending'}`}>
                    {adv.status}
                  </span>
                </td>
                <td>{format(new Date(adv.createdAt), 'MMM dd, yyyy')}</td>
                <td>-</td>
                <td>-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
