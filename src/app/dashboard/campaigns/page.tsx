import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { 
  Plus, 
  ChevronDown,
  Filter,
  Download,
  Search,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function ManageCampaigns({ searchParams }: { searchParams: any }) {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const { q } = await searchParams;

  const campaigns = await prisma.campaign.findMany({
    where: {
      tenantId: session.tenantId,
      OR: q ? [
        { title: { contains: q } }
      ] : undefined
    },
    include: {
      advertiser: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex flex-col gap-4">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#444' }}>Manage Campaigns</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-actions">
            <span>Actions</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="ui-card p-0 overflow-hidden">
        <div className="p-4" style={{ borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8f9fa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: '#666' }}>
            <span>{campaigns.length} Campaigns</span>
            <button className="btn-primary" style={{ padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}><Plus size={12} /> Create New</button>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', color: '#999' }}>
            <Search size={18} />
            <Download size={18} />
            <Filter size={18} />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}><input type="checkbox" /></th>
              <th>ID</th>
              <th>Campaign Name</th>
              <th>Advertiser</th>
              <th>Status</th>
              <th>Payout</th>
              <th>Revenue</th>
              <th>Objective</th>
              <th>Visibility</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((camp) => (
              <tr key={camp.id}>
                <td><input type="checkbox" /></td>
                <td style={{ color: '#999' }}>{camp.id.slice(-5)}</td>
                <td>
                  <div className="flex flex-col">
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{camp.title}</span>
                    <a href={camp.destinationUrl} target="_blank" style={{ fontSize: '0.7rem', color: '#999', display: 'flex', alignItems: 'center', gap: 4 }}>
                      Preview <ExternalLink size={10} />
                    </a>
                  </div>
                </td>
                <td>{camp.advertiser.name}</td>
                <td>
                  <span className={`ui-badge badge-active`}>
                    {camp.status}
                  </span>
                </td>
                <td style={{ color: '#e67e22', fontWeight: 600 }}>$ {camp.payout}</td>
                <td style={{ color: '#27ae60', fontWeight: 600 }}>$ {camp.revenue}</td>
                <td>{camp.objective}</td>
                <td>{camp.visibility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
