import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAffiliate } from './actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AffiliatesPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const affiliates = await prisma.affiliate.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { clicks: true, conversions: true }
      }
    }
  });

  // Calculate base URL for tracking link generation
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <div>
      <h2 className="ui-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Affiliates</h2>

      <div className="ui-grid ui-grid-cols-2" style={{ alignItems: 'start' }}>
        <div className="ui-card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Add New Affiliate</h3>
          <form action={createAffiliate}>
            <div className="ui-form-group">
              <label>Affiliate Name</label>
              <input type="text" name="name" required placeholder="e.g. Traffic Network B" />
            </div>
            <div className="ui-form-group">
              <label>Email Contact</label>
              <input type="email" name="email" required placeholder="contact@network.com" />
            </div>
            <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Add Affiliate</button>
          </form>
        </div>

        <div className="ui-card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Your Affiliates</h3>
          {affiliates.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>No affiliates added yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {affiliates.map((aff: any) => (
                <div key={aff.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontWeight: 600 }}>{aff.name}</h4>
                    <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>ID: {aff.id.slice(0, 8)}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                    {aff.email}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', marginBottom: '1rem', borderTop: '1px solid var(--card-border)', paddingTop: '0.5rem' }}>
                    <span>C: {aff._count.clicks}</span>
                    <span style={{ color: 'var(--primary)' }}>CV: {aff._count.conversions}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem' }}>
                    <p style={{ color: 'var(--muted)', marginBottom: '0.25rem' }}>Tracking link template:</p>
                    <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', display: 'block', wordBreak: 'break-all', color: 'var(--accent)' }}>
                      {baseUrl}/api/track?offer=[OFFER_ID]&aff={aff.id}
                    </code>
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
