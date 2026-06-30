import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  if (!user || user.role !== 'admin') return null;

  const navLinks = [
    { path: '/admin', icon: '📊', label: 'Dashboard' },
    { path: '/admin/chat', icon: '💬', label: 'Live Chat Inbox' },
    { path: '/admin/orders', icon: '📦', label: 'Orders' },
    { path: '/admin/products', icon: '🏷️', label: 'Products' },
    { path: '/admin/customers', icon: '👥', label: 'Customers' }
  ];

  return (
    <div style={{ 
      width: '280px', 
      background: '#12141a', 
      borderRight: '1px solid rgba(255,255,255,0.05)', 
      padding: '2rem 1.5rem', 
      display: 'flex', 
      flexDirection: 'column',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--primary)', color: '#fff', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
          AG
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Admin Portal</h2>
          <span style={{ fontSize: '0.75rem', color: '#4caf50' }}>● System Online</span>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {navLinks.map((link) => {
          const isActive = currentPath === link.path || (link.path !== '/admin' && currentPath.startsWith(link.path));
          return (
            <Link 
              key={link.path} 
              to={link.path} 
              style={{ 
                padding: '0.8rem 1rem', 
                background: isActive ? 'rgba(229,57,53,0.1)' : 'transparent', 
                color: isActive ? 'var(--primary)' : 'var(--text)', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontWeight: isActive ? 'bold' : 'normal', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                transition: 'background 0.2s' 
              }} 
              onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }} 
              onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            👤
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.email}</div>
          </div>
        </div>
        <button 
          onClick={logout} 
          style={{ width: '100%', padding: '0.6rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text)', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }} 
          onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} 
          onMouseOut={(e) => e.target.style.background = 'transparent'}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
