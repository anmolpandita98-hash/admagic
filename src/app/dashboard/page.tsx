import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const offersCount = await prisma.offer.count({ where: { tenantId: session.tenantId } });
  const affiliatesCount = await prisma.affiliate.count({ where: { tenantId: session.tenantId } });
  const clicksCount = await prisma.click.count({ where: { tenantId: session.tenantId } });
  const conversionsCount = await prisma.conversion.count({ where: { tenantId: session.tenantId } });

  const conversions = await prisma.conversion.aggregate({
    where: { tenantId: session.tenantId },
    _sum: { revenue: true, payout: true }
  });

  const totalRevenue = conversions._sum.revenue || 0;
  const totalPayout = conversions._sum.payout || 0;
  const profit = totalRevenue - totalPayout;

  return (
    <div>
      <h2 className="ui-title" style={{ fontSize: '2rem' }}>Overview</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Welcome to your Admagic performance summary.</p>
      
      <div className="ui-grid ui-grid-cols-3">
        <div className="ui-card">
          <div className="ui-stat">
            <span className="ui-stat-label">Clicks</span>
            <span className="ui-stat-value">{clicksCount.toLocaleString()}</span>
          </div>
        </div>
        <div className="ui-card">
          <div className="ui-stat">
            <span className="ui-stat-label">Conversions</span>
            <span className="ui-stat-value">{conversionsCount.toLocaleString()}</span>
          </div>
        </div>
        <div className="ui-card">
          <div className="ui-stat">
            <span className="ui-stat-label">Active Offers</span>
            <span className="ui-stat-value">{offersCount.toLocaleString()}</span>
          </div>
        </div>
        <div className="ui-card">
          <div className="ui-stat">
            <span className="ui-stat-label">Total Revenue</span>
            <span className="ui-stat-value" style={{ color: 'var(--success)' }}>${totalRevenue.toFixed(2)}</span>
          </div>
        </div>
        <div className="ui-card">
          <div className="ui-stat">
            <span className="ui-stat-label">Total Payouts</span>
            <span className="ui-stat-value" style={{ color: 'var(--danger)' }}>${totalPayout.toFixed(2)}</span>
          </div>
        </div>
        <div className="ui-card" style={{ border: '1px solid var(--primary)' }}>
          <div className="ui-stat">
            <span className="ui-stat-label">Net Profit</span>
            <span className="ui-stat-value" style={{ color: 'var(--primary)' }}>${profit.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
