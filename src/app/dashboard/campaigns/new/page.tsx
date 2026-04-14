import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { 
  Megaphone, 
  Target, 
  Globe, 
  Layers, 
  Save,
  ChevronRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CreateCampaign() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const advertisers = await prisma.advertiser.findMany({
    where: { tenantId: session.tenantId },
    select: { id: true, name: true }
  });

  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
        <div style={{ width: 40, height: 40, background: 'var(--primary)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Megaphone size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Define Campaign</h2>
          <p style={{ fontSize: '0.875rem', color: '#888' }}>Complete the steps below to launch your campaign</p>
        </div>
      </div>

      <div className="ui-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section 1: Objective */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 600, color: '#444' }}>
              <Target size={18} color="var(--primary)" />
              1. Select Campaign Objective
            </div>
            <div className="grid grid-cols-4">
              {['CPA', 'CPI', 'CPS', 'CPL'].map(obj => (
                <div key={obj} style={{ border: obj === 'CPA' ? '2px solid var(--primary)' : '1px solid #ddd', padding: '1rem', borderRadius: 8, textAlign: 'center', cursor: 'pointer', background: obj === 'CPA' ? '#f0faff' : 'white' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.75rem', color: obj === 'CPA' ? 'var(--primary)' : '#666' }}>{obj}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Basic Info */}
          <div className="flex flex-col gap-4">
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600, color: '#444' }}>
              <Layers size={18} color="var(--primary)" />
              2. Basic Information
            </div>
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Campaign Title</label>
              <input type="text" placeholder="e.g. Summer E-commerce Sale" style={{ border: '1px solid #ddd', padding: '0.75rem', borderRadius: 4 }} />
            </div>
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Advertiser</label>
              <select style={{ border: '1px solid #ddd', padding: '0.75rem', borderRadius: 4, background: 'white' }}>
                <option value="">Select Advertiser...</option>
                {advertisers.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

           {/* Section 3: Logic */}
           <div className="flex flex-col gap-4">
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600, color: '#444' }}>
              <Globe size={18} color="var(--primary)" />
              3. Destination & Tracking
            </div>
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Destination URL</label>
              <input type="text" placeholder="https://example.com/landing?click_id={click_id}" style={{ border: '1px solid #ddd', padding: '0.75rem', borderRadius: 4 }} />
              <span style={{ fontSize: '0.7rem', color: '#999' }}>Available Macros: {'{click_id}'}, {'{pub_id}'}, {'{p1}'}..{'{p10}'}</span>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Revenue (USD)</label>
                <input type="number" step="0.01" defaultValue="0.00" style={{ border: '1px solid #ddd', padding: '0.75rem', borderRadius: 4 }} />
              </div>
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Payout (USD)</label>
                <input type="number" step="0.01" defaultValue="0.00" style={{ border: '1px solid #ddd', padding: '0.75rem', borderRadius: 4 }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn-primary" style={{ background: '#eee', color: '#666' }}>Cancel</button>
            <button className="btn-primary" style={{ gap: '0.5rem' }}>Create Campaign <ChevronRight size={16} /></button>
          </div>

        </div>
      </div>
    </div>
  );
}
