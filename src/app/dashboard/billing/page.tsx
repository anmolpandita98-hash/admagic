import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CreditCard, CheckCircle, Zap, Shield, Star, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

const PLANS = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    current: false,
    features: ['Up to 5 Campaigns', '2 Publishers', '10,000 Clicks/mo', 'Email Support', 'Basic Reports'],
    color: '#6c757d',
  },
  {
    name: 'Professional',
    price: '$149',
    period: '/month',
    current: true,
    features: ['Unlimited Campaigns', '25 Publishers', '100,000 Clicks/mo', 'Priority Support', 'Advanced Reports', 'Automation Rules', 'CSV Import/Export'],
    color: '#00a2e8',
  },
  {
    name: 'Enterprise',
    price: '$499',
    period: '/month',
    current: false,
    features: ['Unlimited Everything', 'Custom Domain', 'Whitelabel', 'Dedicated AM', 'API Access', 'SLA Guarantee', 'Custom Integrations', 'Team Management'],
    color: '#6f42c1',
  },
];

export default async function BillingPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CreditCard size={20} color="var(--primary)" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#333' }}>Billing & Plans</h2>
      </div>

      {/* Current Plan Status */}
      <div style={{ background: 'linear-gradient(135deg, #00a2e8, #0277bd)', borderRadius: '6px', padding: '1.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8, marginBottom: '0.25rem' }}>Current Plan</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={20} /> Professional
          </div>
          <div style={{ fontSize: '0.82rem', opacity: 0.8, marginTop: '0.25rem' }}>Next billing date: May 1, 2026 · $149.00</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>
            Manage Subscription
          </button>
          <button style={{ padding: '0.5rem 1rem', background: 'white', color: '#0277bd', border: 'none', borderRadius: '4px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 700 }}>
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {PLANS.map(plan => (
          <div key={plan.name} style={{ background: 'white', border: plan.current ? `2px solid ${plan.color}` : '1px solid var(--card-border)', borderRadius: '6px', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {plan.current && (
              <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: plan.color, color: 'white', padding: '0.15rem 0.75rem', borderRadius: '0 0 6px 6px', fontSize: '0.7rem', fontWeight: 700 }}>
                CURRENT PLAN
              </div>
            )}
            <div style={{ textAlign: 'center', marginBottom: '1.25rem', paddingTop: plan.current ? '0.5rem' : 0 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: plan.color, marginBottom: '0.5rem' }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.15rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#333' }}>{plan.price}</span>
                <span style={{ fontSize: '0.85rem', color: '#999' }}>{plan.period}</span>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#555' }}>
                  <CheckCircle size={14} color={plan.color} /> {f}
                </div>
              ))}
            </div>
            <button style={{
              padding: '0.55rem', width: '100%',
              background: plan.current ? '#eee' : plan.color,
              color: plan.current ? '#999' : 'white',
              border: 'none', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 700,
              cursor: plan.current ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem'
            }}>
              {plan.current ? 'Current Plan' : <>Select Plan <ArrowRight size={14} /></>}
            </button>
          </div>
        ))}
      </div>

      {/* Payment History */}
      <div style={{ background: 'white', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', background: '#f8f9fa', borderBottom: '1px solid var(--card-border)', fontWeight: 700, fontSize: '0.75rem', color: '#666' }}>
          PAYMENT HISTORY
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: 'Apr 01, 2026', desc: 'Professional Plan — Monthly', amount: '$149.00', status: 'Paid' },
              { date: 'Mar 01, 2026', desc: 'Professional Plan — Monthly', amount: '$149.00', status: 'Paid' },
              { date: 'Feb 01, 2026', desc: 'Starter Plan — Monthly', amount: '$49.00', status: 'Paid' },
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{row.date}</td>
                <td style={{ color: '#555' }}>{row.desc}</td>
                <td style={{ fontWeight: 700 }}>{row.amount}</td>
                <td><span style={{ background: '#e3fcef', color: '#006644', padding: '0.15rem 0.5rem', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 700 }}>{row.status}</span></td>
                <td><button style={{ padding: '0.2rem 0.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>Download</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
