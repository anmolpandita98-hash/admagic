import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { HelpCircle, MessageSquare, Book, ExternalLink, Mail, Phone, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupportPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <HelpCircle size={20} color="var(--primary)" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#333' }}>Support Center</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div style={{ background: 'white', border: '1px solid var(--card-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e1f5fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={24} color="#0288d1" />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#333' }}>Live Chat</h3>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>Chat with our support team in real-time for instant help.</p>
          <button style={{ padding: '0.5rem 1.25rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginTop: 'auto' }}>
            Start Chat
          </button>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--card-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Book size={24} color="#2e7d32" />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#333' }}>Documentation</h3>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>Browse our knowledge base for guides and API docs.</p>
          <button style={{ padding: '0.5rem 1.25rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Browse Docs <ExternalLink size={13} />
          </button>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--card-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={24} color="#e65100" />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#333' }}>Email Support</h3>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>Send us a ticket and we will respond within 24 hours.</p>
          <button style={{ padding: '0.5rem 1.25rem', background: '#e67e22', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginTop: 'auto' }}>
            Submit Ticket
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: 'white', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', background: '#f8f9fa', borderBottom: '1px solid var(--card-border)', fontWeight: 700, fontSize: '0.75rem', color: '#666' }}>
          FREQUENTLY ASKED QUESTIONS
        </div>
        {[
          { q: 'How do I create a tracking link for a publisher?', a: 'Go to Campaigns → select a campaign → click "Copy Link" in the Actions column. You can customize the link with publisher-specific parameters.' },
          { q: 'How do postback URLs work?', a: 'When a conversion fires, Admagic sends a server-to-server request to the publisher\'s postback URL with the click_id and payout info.' },
          { q: 'Can I import campaigns via CSV?', a: 'Yes! Go to Actions → Bulk Import (CSV) to upload campaigns, advertisers, or publishers in bulk.' },
          { q: 'How do I set up automation rules?', a: 'Navigate to the Automation section in the sidebar. You can create rules for auto-pausing campaigns, sending alert emails, and more.' },
          { q: 'How do I generate invoices?', a: 'Visit the Invoices section. Click "Generate Invoice" to create a new invoice for a publisher based on their conversion data.' },
        ].map((faq, i) => (
          <div key={i} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#333', marginBottom: '0.3rem' }}>{faq.q}</div>
            <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.5 }}>{faq.a}</div>
          </div>
        ))}
      </div>

      {/* Contact Info */}
      <div style={{ background: '#f0faff', border: '1px solid #b3e5fc', borderRadius: '4px', padding: '1rem', display: 'flex', gap: '2rem', fontSize: '0.82rem', color: '#0277bd' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={14} /> support@admagic.com</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={14} /> +1 (800) ADM-AGIC</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> Mon-Fri 9am - 6pm IST</span>
      </div>
    </div>
  );
}
