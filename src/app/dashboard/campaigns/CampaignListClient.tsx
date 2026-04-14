"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ChevronDown, Search, Download, Filter, ExternalLink, ToggleLeft, ToggleRight, Copy, Trash2 } from 'lucide-react';

type Campaign = {
  id: string;
  title: string;
  advertiser: { name: string };
  status: string;
  payout: number;
  revenue: number;
  objective: string;
  visibility: string;
  destinationUrl: string;
};

export default function CampaignListClient({ campaigns: initialCampaigns }: { campaigns: Campaign[] }) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = campaigns.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.advertiser.name.toLowerCase().includes(search.toLowerCase())
  );

  function copyTrackingLink(id: string) {
    navigator.clipboard.writeText(`${window.location.origin}/api/track/click?cid=${id}&pid=YOUR_PUB_ID`);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function toggleStatus(id: string) {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : c));
  }

  const statusColors: Record<string, { bg: string; color: string }> = {
    ACTIVE: { bg: '#e3fcef', color: '#006644' },
    PAUSED: { bg: '#fffadc', color: '#7a5000' },
    PENDING: { bg: '#e1f5fe', color: '#0277bd' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#333' }}>Manage Campaigns</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Actions dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setActionsOpen(!actionsOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Actions <ChevronDown size={13} />
            </button>
            {actionsOpen && (
              <div onMouseLeave={() => setActionsOpen(false)} style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: 'white', border: '1px solid #e0e6ed', borderRadius: '4px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', minWidth: '210px', zIndex: 1000 }}>
                {[
                  { icon: '➕', label: 'Create Campaign', action: () => router.push('/dashboard/campaigns/new') },
                  { icon: '📥', label: 'Import Campaigns (CSV)', action: () => alert('CSV import coming soon') },
                  { icon: '📤', label: 'Export Campaigns (CSV)', action: () => alert('Exporting...') },
                  null,
                  { icon: '▶️', label: 'Set All Active', action: () => setCampaigns(prev => prev.map(c => ({ ...c, status: 'ACTIVE' }))) },
                  { icon: '⏸️', label: 'Pause All', action: () => setCampaigns(prev => prev.map(c => ({ ...c, status: 'PAUSED' }))) },
                ].map((item, i) =>
                  item === null ? (
                    <div key={i} style={{ height: '1px', background: '#e0e6ed', margin: '4px 0' }} />
                  ) : (
                    <button key={i} onClick={() => { item.action(); setActionsOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.55rem 1rem', fontSize: '0.8rem', color: '#333', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f4f7f6')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span>{item.icon}</span> {item.label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
          {/* Create New button */}
          <button
            onClick={() => router.push('/dashboard/campaigns/new')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
          >
            <Plus size={14} /> Create Campaign
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search campaigns..."
          style={{ width: '100%', border: '1px solid #ddd', padding: '0.5rem 0.75rem 0.5rem 2.25rem', borderRadius: '4px', fontSize: '0.8rem' }}
        />
      </div>

      {/* Table */}
      <div style={{ background: 'white', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', background: '#f8f9fa', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666' }}>{filtered.length} CAMPAIGNS</span>
          <div style={{ display: 'flex', gap: '0.5rem', color: '#999' }}>
            <Download size={16} style={{ cursor: 'pointer' }} />
            <Filter size={16} style={{ cursor: 'pointer' }} />
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>ID</th>
              <th>Campaign</th>
              <th>Advertiser</th>
              <th>Status</th>
              <th>Objective</th>
              <th>Payout</th>
              <th>Revenue</th>
              <th>Visibility</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>No campaigns found</td></tr>
            ) : filtered.map(camp => (
              <tr key={camp.id}>
                <td><input type="checkbox" /></td>
                <td style={{ color: '#999', fontSize: '0.75rem' }}>{camp.id.slice(-6)}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{camp.title}</span>
                    <a href={camp.destinationUrl} target="_blank" style={{ fontSize: '0.7rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
                      Preview <ExternalLink size={10} />
                    </a>
                  </div>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{camp.advertiser.name}</td>
                <td>
                  <span style={{ display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 700, ...(statusColors[camp.status] || { bg: '#eee', color: '#666' }) }}>
                    {camp.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.8rem' }}>{camp.objective}</td>
                <td style={{ color: '#e67e22', fontWeight: 700 }}>${camp.payout}</td>
                <td style={{ color: '#28a745', fontWeight: 700 }}>${camp.revenue}</td>
                <td style={{ fontSize: '0.8rem' }}>{camp.visibility}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    <button onClick={() => copyTrackingLink(camp.id)} title="Copy tracking link" style={{ padding: '0.2rem 0.4rem', background: copied === camp.id ? '#28a745' : '#f0f0f0', color: copied === camp.id ? 'white' : '#555', border: 'none', borderRadius: '3px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 700 }}>
                      {copied === camp.id ? '✓ Copied' : <><Copy size={11} /> Link</>}
                    </button>
                    <button onClick={() => toggleStatus(camp.id)} title="Toggle status" style={{ background: 'none', border: 'none', cursor: 'pointer', color: camp.status === 'ACTIVE' ? '#28a745' : '#ccc' }}>
                      {camp.status === 'ACTIVE' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
