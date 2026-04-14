import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createOffer } from './actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OffersPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const offers = await prisma.offer.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="ui-title" style={{ fontSize: '2rem', marginBottom: 0 }}>Offers</h2>
      </div>

      <div className="ui-grid ui-grid-cols-2" style={{ alignItems: 'start' }}>
        <div className="ui-card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Create New Offer</h3>
          <form action={createOffer}>
            <div className="ui-form-group">
              <label>Offer Name</label>
              <input type="text" name="name" required placeholder="e.g. Summer Sale Campaign" />
            </div>
            <div className="ui-form-group">
              <label>Destination URL</label>
              <input type="url" name="destinationUrl" required placeholder="https://example.com/lander" />
            </div>
            <div className="ui-form-group">
              <label>Revenue ($)</label>
              <input type="number" step="0.01" name="revenue" required placeholder="10.00" />
            </div>
            <div className="ui-form-group">
              <label>Payout ($)</label>
              <input type="number" step="0.01" name="payout" required placeholder="8.00" />
            </div>
            <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Create Offer</button>
          </form>
        </div>

        <div className="ui-card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Your Offers</h3>
          {offers.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>No offers created yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {offers.map((offer: any) => (
                <div key={offer.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontWeight: 600 }}>{offer.name}</h4>
                    <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>ID: {offer.id.slice(0, 8)}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                    {offer.destinationUrl}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--success)' }}>Rev: ${offer.revenue.toFixed(2)}</span>
                    <span style={{ color: 'var(--danger)' }}>Pay: ${offer.payout.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
