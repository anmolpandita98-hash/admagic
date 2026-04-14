"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to sign up');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
        <div className="ui-card" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="ui-title" style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="ui-form-group">
              <label>Company Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Inc." />
            </div>
            <div className="ui-form-group">
              <label>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@acme.com" />
            </div>
            <div className="ui-form-group">
              <label>Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Get Started</button>
          </form>
          <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem' }}>
            Already have an account? <Link href="/auth/login" style={{ color: 'var(--primary)' }}>Log in</Link>
          </div>
        </div>
      </div>
    </>
  );
}
