import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 80px)', padding: '6rem 2rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background Gradients */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'rgba(99, 102, 241, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: -1 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '600px', height: '600px', background: 'rgba(168, 85, 247, 0.15)', filter: 'blur(120px)', borderRadius: '50%', zIndex: -1 }}></div>

        <div className="ui-container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(20, 184, 166, 0.1)', color: '#14b8a6', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem' }}>
            <span style={{ display: 'block', width: '8px', height: '8px', background: '#14b8a6', borderRadius: '50%' }}></span>
            Admagic Beta Platform Live
          </div>
          <h1 className="ui-title" style={{ fontSize: '4rem', maxWidth: '800px', margin: '0 auto 1.5rem', lineHeight: '1.1' }}>
            Scale your <span className="ui-gradient-text">Affiliate Marketing</span> to new dimensions.
          </h1>
          <p className="ui-subtitle" style={{ fontSize: '1.25rem', margin: '0 auto 3rem', maxWidth: '600px' }}>
            The ultimate performance marketing software. Track, manage, and optimize your network with real-time analytics, automated payouts, and enterprise-grade infrastructure.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '5rem' }}>
            <Link href="/auth/signup" className="ui-btn" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Start for Free
            </Link>
            <Link href="/auth/login" className="ui-btn ui-btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              View Demo
            </Link>
          </div>

          <div className="ui-grid ui-grid-cols-3" style={{ textAlign: 'left', marginTop: '4rem' }}>
            <div className="ui-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Real-time Tracking</h3>
              <p style={{ color: 'var(--muted)' }}>Zero-latency click tracking architecture designed to handle massive scale.</p>
            </div>
            
            <div className="ui-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Advanced Analytics</h3>
              <p style={{ color: 'var(--muted)' }}>Comprehensive dashboard giving you a birds-eye view of your network's performance.</p>
            </div>

            <div className="ui-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(20, 184, 166, 0.1)', color: '#2dd4bf', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Secure Multitenancy</h3>
              <p style={{ color: 'var(--muted)' }}>Strict data boundaries ensuring your sensitive affiliate business data remains yours.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
