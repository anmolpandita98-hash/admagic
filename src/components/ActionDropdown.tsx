"use client";
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Action {
  label: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
  divider?: boolean;
}

export default function ActionDropdown({ actions }: { actions: Action[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          background: 'var(--primary)', color: 'white', border: 'none',
          padding: '0.45rem 0.9rem', borderRadius: '4px',
          fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
          letterSpacing: '0.02em'
        }}
      >
        Actions <ChevronDown size={13} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0,
          background: 'white', border: '1px solid #e0e6ed',
          borderRadius: '4px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          minWidth: '200px', zIndex: 1000
        }}>
          {actions.map((action, i) =>
            action.divider ? (
              <div key={i} style={{ height: '1px', background: '#e0e6ed', margin: '4px 0' }} />
            ) : action.href ? (
              <a
                key={i}
                href={action.href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.55rem 1rem', fontSize: '0.8rem',
                  color: action.danger ? '#dc3545' : '#333',
                  textDecoration: 'none', transition: 'background 0.15s'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f4f7f6')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {action.icon && <span>{action.icon}</span>}
                {action.label}
              </a>
            ) : (
              <button
                key={i}
                onClick={() => { action.onClick?.(); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  width: '100%', padding: '0.55rem 1rem', fontSize: '0.8rem',
                  color: action.danger ? '#dc3545' : '#333',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', transition: 'background 0.15s'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f4f7f6')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {action.icon && <span>{action.icon}</span>}
                {action.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
