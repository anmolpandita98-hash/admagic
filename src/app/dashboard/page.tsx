import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { 
  TrendingUp, 
  CheckCircle2, 
  CreditCard, 
  DollarSign, 
  Clock
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const USD_TO_INR = 84.5;

function formatDual(val: number) {
  return (
    <div className="kpi-val-group">
      <span className="kpi-value">₹ {(val * USD_TO_INR).toLocaleString('en-IN', { maximumFractionDigits: 0 })}K</span>
      <span className="kpi-value-currency">$ {val.toLocaleString()}</span>
    </div>
  );
}

export default async function DashboardOverview() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const tenantId = session.tenantId;

  // Time boundaries
  const now = new Date();
  const todayStart = new Date(new Date(now).setHours(0, 0, 0, 0));
  const yesterdayStart = new Date(new Date(todayStart).setDate(todayStart.getDate() - 1));
  const yesterdayEnd = new Date(todayStart);
  const monthStart = new Date(new Date(now).setDate(1));
  monthStart.setHours(0, 0, 0, 0);

  // Aggregation Helper
  async function getMetrics(start: Date, end?: Date) {
    const where = { tenantId, createdAt: { gte: start, lt: end } };
    const convs = await prisma.conversion.aggregate({
      where,
      _sum: { revenue: true, payout: true },
      _count: { id: true }
    });
    return {
      revenue: convs._sum.revenue || 0,
      payout: convs._sum.payout || 0,
      conversions: convs._count.id || 0,
      profit: (convs._sum.revenue || 0) - (convs._sum.payout || 0)
    };
  }

  const today = await getMetrics(todayStart);
  const yesterday = await getMetrics(yesterdayStart, yesterdayEnd);
  const mtd = await getMetrics(monthStart);

  // Hourly Data Calculation
  const hourlyData = [];
  for (let h = 0; h < 24; h++) {
    const hStart = new Date(new Date(todayStart).setHours(h));
    const hEnd = new Date(new Date(todayStart).setHours(h + 1));
    
    const clicks = await prisma.click.count({ where: { tenantId, createdAt: { gte: hStart, lt: hEnd } } });
    const metric = await getMetrics(hStart, hEnd);
    
    hourlyData.push({
      hour: `${h === 0 ? 12 : h > 12 ? h - 12 : h} ${h >= 12 ? 'pm' : 'am'} - ${h + 1 === 12 ? 12 : h + 1 > 12 ? h + 1 - 12 : h + 1} ${h + 1 >= 12 ? 'pm' : 'am'}`,
      clicks,
      ...metric
    });
  }

  const kpis = [
    { label: 'Revenue', icon: TrendingUp, today: today.revenue, yesterday: yesterday.revenue, mtd: mtd.revenue },
    { label: 'Conversions', icon: CheckCircle2, today: today.conversions, yesterday: yesterday.conversions, mtd: mtd.conversions, isCount: true },
    { label: 'Payout', icon: CreditCard, today: today.payout, yesterday: yesterday.payout, mtd: mtd.payout },
    { label: 'Profit', icon: DollarSign, today: today.profit, yesterday: yesterday.profit, mtd: mtd.profit },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="ui-card kpi-card">
            <div className="kpi-title">
              <kpi.icon size={16} color="var(--primary)" />
              {kpi.label}
            </div>
            <div className="kpi-grid">
              <div className="kpi-val-group">
                <span className="kpi-label">Today</span>
                {kpi.isCount ? <span className="kpi-value" style={{ color: 'var(--primary)', fontSize: '1rem' }}>{kpi.today}</span> : formatDual(kpi.today)}
              </div>
              <div className="kpi-val-group">
                <span className="kpi-label">Yesterday</span>
                {kpi.isCount ? <span className="kpi-value">{kpi.yesterday}</span> : formatDual(kpi.yesterday)}
              </div>
              <div className="kpi-val-group">
                <span className="kpi-label">MTD</span>
                {kpi.isCount ? <span className="kpi-value">{kpi.mtd}</span> : formatDual(kpi.mtd)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="ui-card p-0 overflow-hidden">
        <div className="p-4" style={{ borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.75rem', color: '#666' }}>
          <Clock size={16} />
          HOURLY DATA
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Hour</th>
              <th>Clicks</th>
              <th>Conversions</th>
              <th>CR %</th>
              <th>EPC</th>
              <th>Payout</th>
              <th>Revenue</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {hourlyData.map((row) => {
              const cr = row.clicks > 0 ? (row.conversions / row.clicks) * 100 : 0;
              const epc = row.clicks > 0 ? row.revenue / row.clicks : 0;
              return (
                <tr key={row.hour}>
                  <td style={{ fontWeight: 600, color: '#444' }}>{row.hour}</td>
                  <td><span className="ui-badge" style={{ background: '#e1f5fe', color: '#039be5' }}>{row.clicks}</span></td>
                  <td>{row.conversions}</td>
                  <td>{cr.toFixed(2)} %</td>
                  <td>$ {epc.toFixed(3)}</td>
                  <td style={{ color: '#e67e22', fontWeight: 600 }}>$ {row.payout.toFixed(2)}</td>
                  <td style={{ color: '#27ae60', fontWeight: 600 }}>$ {row.revenue.toFixed(2)}</td>
                  <td style={{ color: '#2980b9', fontWeight: 600 }}>$ {row.profit.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
