"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Megaphone, Target, Globe, Layers, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

type Advertiser = { id: string; name: string };

const OBJECTIVES = [
  { code: 'CPA', name: 'Cost Per Action', desc: 'Pay per user action (signup, purchase)' },
  { code: 'CPI', name: 'Cost Per Install', desc: 'Pay per app install' },
  { code: 'CPS', name: 'Cost Per Sale', desc: 'Pay per completed sale' },
  { code: 'CPL', name: 'Cost Per Lead', desc: 'Pay per lead generated' },
  { code: 'CPC', name: 'Cost Per Click', desc: 'Pay per click' },
  { code: 'CPM', name: 'Cost Per Mille', desc: 'Pay per 1000 impressions' },
];

export default function CreateCampaignClient({ advertisers }: { advertisers: Advertiser[] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    objective: 'CPA',
    title: '',
    advertiserId: '',
    destinationUrl: '',
    revenue: '',
    payout: '',
    visibility: 'PUBLIC',
    trackingMethod: 'POSTBACK',
    countries: '',
    devices: '',
    os: '',
  });

  function update(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  async function submit() {
    setLoading(true);
    setError('');
    try {
      const targeting = {
        countries: form.countries ? form.countries.split(',').map(s => s.trim().toUpperCase()) : [],
        devices: form.devices ? form.devices.split(',').map(s => s.trim()) : [],
        os: form.os ? form.os.split(',').map(s => s.trim()) : [],
      };

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, targeting }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      setTimeout(() => router.push('/dashboard/campaigns'), 1500);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <CheckCircle size={64} color="#28a745" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#333' }}>Campaign Created!</h2>
        <p style={{ color: '#888' }}>Redirecting to campaigns list...</p>
      </div>
    );
  }

  const steps = [
    { n: 1, label: 'Objective' },
    { n: 2, label: 'Basic Info' },
    { n: 3, label: 'Tracking' },
    { n: 4, label: 'Targeting' },
  ];

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Megaphone size={18} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Create Campaign</h2>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>Step {step} of {steps.length}</p>
        </div>
      </div>

      {/* Step tracker */}
      <div style={{ display: 'flex', gap: 0 }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flex: 1 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', background: step >= s.n ? 'var(--primary)' : '#e0e6ed', color: step >= s.n ? 'white' : '#999', cursor: step < s.n ? 'default' : 'pointer', transition: 'all 0.2s' }}
                onClick={() => step > s.n && setStep(s.n)}>
                {step > s.n ? '✓' : s.n}
              </div>
              <span style={{ fontSize: '0.7rem', color: step >= s.n ? 'var(--primary)' : '#999', fontWeight: step === s.n ? 700 : 400 }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && <div style={{ height: 2, background: step > s.n ? 'var(--primary)' : '#e0e6ed', flex: 1, transformOrigin: 'left', marginBottom: '1.2rem' }} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div style={{ background: 'white', border: '1px solid var(--card-border)', padding: '1.5rem', minHeight: '320px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Step 1: Objective */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Target size={18} color="var(--primary)" />
              <span style={{ fontWeight: 700, color: '#444' }}>Select Campaign Objective</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {OBJECTIVES.map(obj => (
                <div key={obj.code} onClick={() => update('objective', obj.code)}
                  style={{ border: form.objective === obj.code ? '2px solid var(--primary)' : '1px solid #ddd', padding: '1rem', borderRadius: '6px', cursor: 'pointer', background: form.objective === obj.code ? '#f0faff' : 'white', transition: 'all 0.15s' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: form.objective === obj.code ? 'var(--primary)' : '#555', marginBottom: '0.25rem' }}>{obj.code}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#444' }}>{obj.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.2rem' }}>{obj.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Layers size={18} color="var(--primary)" />
              <span style={{ fontWeight: 700, color: '#444' }}>Basic Information</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555' }}>Campaign Title *</label>
                <input value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Summer E-commerce Sale" style={{ border: '1px solid #ddd', padding: '0.6rem', borderRadius: '4px', fontSize: '0.85rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555' }}>Advertiser *</label>
                <select value={form.advertiserId} onChange={e => update('advertiserId', e.target.value)} style={{ border: '1px solid #ddd', padding: '0.6rem', borderRadius: '4px', fontSize: '0.85rem', background: 'white' }}>
                  <option value="">Select advertiser...</option>
                  {advertisers.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555' }}>Visibility</label>
                <select value={form.visibility} onChange={e => update('visibility', e.target.value)} style={{ border: '1px solid #ddd', padding: '0.6rem', borderRadius: '4px', fontSize: '0.85rem', background: 'white' }}>
                  <option value="PUBLIC">Public — Visible to all publishers</option>
                  <option value="PRIVATE">Private — Invite only</option>
                  <option value="REQUIRE_PERMISSION">Require Permission</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555' }}>Tracking Method</label>
                <select value={form.trackingMethod} onChange={e => update('trackingMethod', e.target.value)} style={{ border: '1px solid #ddd', padding: '0.6rem', borderRadius: '4px', fontSize: '0.85rem', background: 'white' }}>
                  <option value="POSTBACK">Server Postback URL</option>
                  <option value="PIXEL">Pixel / Image</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Tracking */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Globe size={18} color="var(--primary)" />
              <span style={{ fontWeight: 700, color: '#444' }}>Destination URL & Payouts</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555' }}>Destination URL *</label>
              <input value={form.destinationUrl} onChange={e => update('destinationUrl', e.target.value)} placeholder="https://example.com/lp?click_id={click_id}&pub={pub_id}" style={{ border: '1px solid #ddd', padding: '0.6rem', borderRadius: '4px', fontSize: '0.85rem' }} />
              <div style={{ background: '#f0faff', border: '1px solid #b3e5fc', borderRadius: '4px', padding: '0.6rem', fontSize: '0.75rem', color: '#0277bd' }}>
                <strong>Available Macros:</strong> {`{click_id}`} · {`{pub_id}`} · {`{campaign_id}`} · {`{p1}`} · {`{p2}`} · {`{p3}`} · {`{country}`} · {`{device}`}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#55a' }}>Revenue (USD) — what advertiser pays you</label>
                <input type="number" step="0.01" min="0" value={form.revenue} onChange={e => update('revenue', e.target.value)} placeholder="0.00" style={{ border: '1px solid #ddd', padding: '0.6rem', borderRadius: '4px', fontSize: '0.85rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#55a' }}>Payout (USD) — what you pay publisher</label>
                <input type="number" step="0.01" min="0" value={form.payout} onChange={e => update('payout', e.target.value)} placeholder="0.00" style={{ border: '1px solid #ddd', padding: '0.6rem', borderRadius: '4px', fontSize: '0.85rem' }} />
              </div>
            </div>
            {form.revenue && form.payout && (
              <div style={{ background: '#e3fcef', border: '1px solid #b2dfdb', borderRadius: '4px', padding: '0.6rem', fontSize: '0.8rem', color: '#1b5e20', fontWeight: 600 }}>
                ✓ Margin: ${(parseFloat(form.revenue || '0') - parseFloat(form.payout || '0')).toFixed(2)} per conversion ({form.revenue && form.payout ? (((parseFloat(form.revenue) - parseFloat(form.payout)) / parseFloat(form.revenue)) * 100).toFixed(1) : 0}%)
              </div>
            )}
          </div>
        )}

        {/* Step 4: Targeting */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Target size={18} color="var(--primary)" />
              <span style={{ fontWeight: 700, color: '#444' }}>Targeting (Optional)</span>
            </div>
            <div style={{ background: '#fffadc', border: '1px solid #ffe082', borderRadius: '4px', padding: '0.6rem', fontSize: '0.75rem', color: '#7a5000' }}>
              Leave blank to allow all traffic. Separate multiple values with commas.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555' }}>Countries (ISO codes)</label>
                <input value={form.countries} onChange={e => update('countries', e.target.value)} placeholder="IN, US, GB" style={{ border: '1px solid #ddd', padding: '0.6rem', borderRadius: '4px', fontSize: '0.85rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555' }}>Device Types</label>
                <input value={form.devices} onChange={e => update('devices', e.target.value)} placeholder="Mobile, Desktop, Tablet" style={{ border: '1px solid #ddd', padding: '0.6rem', borderRadius: '4px', fontSize: '0.85rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555' }}>Operating Systems</label>
                <input value={form.os} onChange={e => update('os', e.target.value)} placeholder="Android, iOS, Windows" style={{ border: '1px solid #ddd', padding: '0.6rem', borderRadius: '4px', fontSize: '0.85rem' }} />
              </div>
            </div>
            {/* Summary */}
            <div style={{ background: '#f8f9fa', border: '1px solid var(--card-border)', borderRadius: '4px', padding: '1rem', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', marginBottom: '0.5rem' }}>CAMPAIGN SUMMARY</div>
              {[
                { label: 'Title', value: form.title || '—' },
                { label: 'Objective', value: form.objective },
                { label: 'Advertiser', value: advertisers.find(a => a.id === form.advertiserId)?.name || '—' },
                { label: 'Revenue/Payout', value: `$${form.revenue || '0'} / $${form.payout || '0'}` },
                { label: 'Visibility', value: form.visibility },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#999', minWidth: '100px' }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: '#333' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && <div style={{ background: '#ffe9e9', border: '1px solid #f5c6cb', borderRadius: '4px', padding: '0.75rem', fontSize: '0.85rem', color: '#721c24' }}>{error}</div>}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => step > 1 ? setStep(step - 1) : router.push('/dashboard/campaigns')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', background: '#eee', color: '#555', border: 'none', borderRadius: '4px', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
          <ChevronLeft size={16} /> {step > 1 ? 'Back' : 'Cancel'}
        </button>
        {step < 4 ? (
          <button onClick={() => setStep(step + 1)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 700 }}>
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={submit} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.5rem', background: loading ? '#aaa' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.875rem', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
            {loading ? 'Creating...' : <><CheckCircle size={16} /> Create Campaign</>}
          </button>
        )}
      </div>
    </div>
  );
}
