import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="ui-nav">
      <Link href="/" className="ui-logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Ad<span>magic</span>
      </Link>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/auth/login" className="ui-btn ui-btn-secondary">Log in</Link>
        <Link href="/auth/signup" className="ui-btn">Sign up</Link>
      </div>
    </nav>
  );
}
