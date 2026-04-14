import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminOverview() {
  const tenantsCount = await prisma.tenant.count();
  const totalClicks = await prisma.click.count();
  const totalConversions = await prisma.conversion.count();
  
  const revenueData = await prisma.conversion.aggregate({
    _sum: {
      revenue: true,
      payout: true
    }
  });

  const totalRevenue = revenueData._sum.revenue || 0;
  const totalPayout = revenueData._sum.payout || 0;
  const netProfit = totalRevenue - totalPayout;

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Platform Overview</h1>
        <p className="subtitle">Global performance metrics for All Tenants</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card ui-card">
          <span className="stat-label">Total Tenants</span>
          <span className="stat-value">{tenantsCount}</span>
        </div>
        <div className="stat-card ui-card">
          <span className="stat-label">Global Clicks</span>
          <span className="stat-value">{totalClicks.toLocaleString()}</span>
        </div>
        <div className="stat-card ui-card">
          <span className="stat-label">Global Conversions</span>
          <span className="stat-value">{totalConversions.toLocaleString()}</span>
        </div>
        <div className="stat-card ui-card">
          <span className="stat-label">Platform Profit</span>
          <span className="stat-value text-gradient">
            ${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="admin-sections-grid" style={{ marginTop: '2rem' }}>
        <div className="ui-card recent-activity">
          <h3>System Health</h3>
          <div className="activity-placeholder">
            <p>Database: Operational (SQLite)</p>
            <p>Tracking Engine: Active</p>
            <p>Postback Listener: Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
