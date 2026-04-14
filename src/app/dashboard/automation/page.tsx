"use client";
import { useState } from 'react';
import { Zap, Plus, ToggleLeft, ToggleRight, Edit2, Trash2, Mail, AlertTriangle, Clock } from 'lucide-react';

type Rule = {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  status: 'ACTIVE' | 'PAUSED';
};

const INITIAL_RULES: Rule[] = [
  { id: '1', name: 'Low CR Alert', trigger: 'CR drops below 1%', condition: 'Campaign CR < 1% for 2 hours', action: 'Send email notification', status: 'ACTIVE' },
  { id: '2', name: 'High Volume Pause', trigger: 'Clicks exceed 5000/day', condition: 'Daily clicks > 5000', action: 'Pause campaign', status: 'ACTIVE' },
  { id: '3', name: 'Budget Cap', trigger: 'Payout reaches $500', condition: 'Daily payout ≥ $500', action: 'Pause campaign + notify', status: 'PAUSED' },
];

const TRIGGER_OPTIONS = [
  'CR drops below threshold',
  'Clicks exceed daily cap',
  'Payout reaches budget cap',
  'Conversion rate spikes',
  'Publisher clicks drop to 0',
  'Daily revenue target reached',
];

export default function AutomationPage() {
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [showForm, setShowForm] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', trigger: '', condition: '', action: '' });

  function toggleRule(id: string) {
    setRules(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : r));
  }

  function deleteRule(id: string) {
    setRules(prev => prev.filter(r => r.id !== id));
  }

  function addRule() {
    if (!newRule.name || !newRule.trigger) return;
    setRules(prev => [...prev, { id: Date.now().toString(), ...newRule, status: 'ACTIVE' }]);
    setNewRule({ name: '', trigger: '', condition: '', action: '' });
    setShowForm(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#333' }}>Automation Rules</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
        >
          <Plus size={14} /> Add Rule
        </button>
      </div>

      {/* Info Banner */}
      <div style={{ background: '#e1f5fe', border: '1px solid #b3e5fc', borderRadius: '4px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#0277bd' }}>
        <AlertTriangle size={15} />
        Automation rules run every 15 minutes. Paused campaigns can be manually resumed from the Campaigns page.
      </div>

      {/* Add Rule Form */}
      {showForm && (
        <div style={{ background: 'white', border: '2px solid var(--primary)', borderRadius: '4px', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#444' }}>+ New Automation Rule</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666', display: 'block', marginBottom: '0.25rem' }}>Rule Name</label>
              <input value={newRule.name} onChange={e => setNewRule(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Low CR Alert" style={{ width: '100%', border: '1px solid #ddd', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666', display: 'block', marginBottom: '0.25rem' }}>Trigger</label>
              <select value={newRule.trigger} onChange={e => setNewRule(p => ({ ...p, trigger: e.target.value }))} style={{ width: '100%', border: '1px solid #ddd', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', background: 'white' }}>
                <option value="">Select trigger...</option>
                {TRIGGER_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666', display: 'block', marginBottom: '0.25rem' }}>Condition</label>
              <input value={newRule.condition} onChange={e => setNewRule(p => ({ ...p, condition: e.target.value }))} placeholder="e.g. CR < 1% for 2 hours" style={{ width: '100%', border: '1px solid #ddd', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666', display: 'block', marginBottom: '0.25rem' }}>Action</label>
              <select value={newRule.action} onChange={e => setNewRule(p => ({ ...p, action: e.target.value }))} style={{ width: '100%', border: '1px solid #ddd', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', background: 'white' }}>
                <option value="">Select action...</option>
                <option value="Send email notification">Send email notification</option>
                <option value="Pause campaign">Pause campaign</option>
                <option value="Pause campaign + notify">Pause campaign + notify</option>
                <option value="Reduce payout by 10%">Reduce payout by 10%</option>
                <option value="Block publisher traffic">Block publisher traffic</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowForm(false)} style={{ padding: '0.4rem 0.9rem', background: '#eee', color: '#666', border: 'none', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
            <button onClick={addRule} style={{ padding: '0.4rem 0.9rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Create Rule</button>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div style={{ background: 'white', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', background: '#f8f9fa', borderBottom: '1px solid var(--card-border)', fontWeight: 700, fontSize: '0.75rem', color: '#666' }}>
          ACTIVE RULES — {rules.length} RULES
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Rule Name</th>
              <th>Trigger</th>
              <th>Condition</th>
              <th>Action</th>
              <th>Status</th>
              <th>Controls</th>
            </tr>
          </thead>
          <tbody>
            {rules.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>No rules yet. Click "+ Add Rule" to get started.</td></tr>
            ) : rules.map(rule => (
              <tr key={rule.id}>
                <td style={{ fontWeight: 700 }}>{rule.name}</td>
                <td style={{ fontSize: '0.8rem' }}>{rule.trigger}</td>
                <td style={{ fontSize: '0.8rem', color: '#666' }}>{rule.condition}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', background: '#f0f4ff', color: '#3b5bdb', padding: '0.2rem 0.5rem', borderRadius: '3px', fontWeight: 600 }}>
                    <Mail size={11} /> {rule.action}
                  </span>
                </td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '3px', ...(rule.status === 'ACTIVE' ? { background: '#e3fcef', color: '#006644' } : { background: '#fffadc', color: '#7a5000' }) }}>
                    <Clock size={11} /> {rule.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <button onClick={() => toggleRule(rule.id)} title={rule.status === 'ACTIVE' ? 'Pause' : 'Activate'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: rule.status === 'ACTIVE' ? '#28a745' : '#999' }}>
                      {rule.status === 'ACTIVE' ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    </button>
                    <button onClick={() => deleteRule(rule.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }}>
                      <Trash2 size={16} />
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
