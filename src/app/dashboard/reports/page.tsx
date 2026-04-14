import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { BarChart3, Download, Filter, Clock, TrendingUp } from 'lucide-react';
import { format, subDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function CampaignReports({ searchParams }: { searchParams: any }) {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const { from, to } = await searchParams;
  const endDate = to ? new Date(to) : new Date();
  const startDate = from ? new Date(from) : subDays(endDate, 7);

  const clicks = await prisma.click.findMany({
    where: { tenantId: session.tenantId, createdAt: { gte: startDate, lte: endDate } },
    include: { campaign: true, publisher: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const conversions = await prisma.conversion.findMany({
    where: { tenantId: session.tenantId, createdAt: { gte: startDate, lte: endDate } },
    include: { campaign: true, publisher: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  type CampaignRow = { title: string; clicks: number; conversions: number; revenue: number; payout: number; profit: number; cr: number };
  const campaignMap: Record<string, CampaignRow> = {};

  for (const c of clicks) {
    if (!campaignMap[c.campaignId]) {
      campaignMap[c.campaignId] = { title: c.campaign.title, clicks: 0, conversions: 0, revenue: 0, payout: 0, profit: 0, cr: 0 };
    }
    campaignMap[c.campaignId].clicks++;
  }
  for (const c of conversions) {
    if (!campaignMap[c.campaignId]) {
      campaignMap[c.campaignId] = { title: c.campaign.title, clicks: 0, conversions: 0, revenue: 0, payout: 0, profit: 0, cr: 0 };
    }
    campaignMap[c.campaignId].conversions++;
    campaignMap[c.campaignId].revenue += c.revenue;
    campaignMap[c.campaignId].payout += c.payout;
  }

  const rows = Object.values(campaignMap).map(row => ({
    ...row,
    profit: row.revenue - row.payout,
    cr: row.clicks > 0 ? (row.conversions / row.clicks) * 100 : 0,
  }));

  const totalClicks = rows.reduce((s, r) => s + r.clicks, 0);
  const totalConversions = rows.reduce((s, r) => s + r.conversions, 0);
  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
  const totalPayout = rows.reduce((s, r) => s + r.payout, 0);
  const totalProfit = totalRevenue - totalPayout;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#333' }}>Campaign Reports</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            <Download size={14} /> Export CSV
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            💾 Save Report
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div style={{ background: 'white', border: '1px solid var(--card-border)', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Filter size={16} color="#999" />
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Date Range:</span>
        <form method="GET" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input type="date" name="from" defaultValue={format(startDate, 'yyyy-MM-dd')} style={{ border: '1px solid #ddd', padding: '0.35rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }} />
          <span style={{ color: '#999' }}>to</span>
          <input type="date" name="to" defaultValue={format(endDate, 'yyyy-MM-dd')} style={{ border: '1px solid #ddd', padding: '0.35rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }} />
          <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Apply</button>
        </form>
        <span style={{ fontSize: '0.75rem', color: '#999', marginLeft: 'auto' }}>Showing: {format(startDate, 'MMM dd')} – {format(endDate, 'MMM dd, yyyy')}</span>
      </div>

      {/* Totals Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
        {[
          { label: 'Total Clicks', value: totalClicks, color: '#00a2e8' },
          { label: 'Conversions', value: totalConversions, color: '#6f42c1' },
          { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, color: '#28a745' },
          { label: 'Payout', value: `$${totalPayout.toFixed(2)}`, color: '#e67e22' },
          { label: 'Profit', value: `$${totalProfit.toFixed(2)}`, color: '#2980b9' },
        ].map(item => (
          <div key={item.label} style={{ background: 'white', border: '1px solid var(--card-border)', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: item.color }}>{item.value}</div>
            <div style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', marginTop: '2px' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div style={{ background: 'white', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', background: '#f8f9fa', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.75rem', color: '#666' }}>
          <TrendingUp size={14} /> CAMPAIGN PERFORMANCE — {rows.length} CAMPAIGNS
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Clicks</th>
              <th>Conversions</th>
              <th>CR %</th>
              <th>Revenue</th>
              <th>Payout</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>No data for this period</td></tr>
            ) : rows.map((row, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{row.title}</td>
                <td><span style={{ background: '#e1f5fe', color: '#0288d1', padding: '0.15rem 0.5rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 700 }}>{row.clicks}</span></td>
                <td>{row.conversions}</td>
                <td>{row.cr.toFixed(2)}%</td>
                <td style={{ color: '#28a745', fontWeight: 600 }}>${row.revenue.toFixed(2)}</td>
                <td style={{ color: '#e67e22', fontWeight: 600 }}>${row.payout.toFixed(2)}</td>
                <td style={{ color: '#2980b9', fontWeight: 700 }}>${row.profit.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
