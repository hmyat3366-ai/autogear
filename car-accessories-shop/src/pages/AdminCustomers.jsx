import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminCustomers() {
  const { user, registeredUsers } = useAuth();

  if (!user || user.role !== 'admin') {
    return <div style={{ textAlign: 'center', padding: '4rem' }}><h2>Access Denied</h2></div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#0a0b0e' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', background: '#12141a', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--primary)', color: '#fff', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AG</div>
          <div><h2 style={{ margin: 0, fontSize: '1.1rem' }}>Admin Portal</h2></div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/admin" style={{ padding: '0.8rem 1rem', color: 'var(--text)', textDecoration: 'none', borderRadius: '8px', display: 'flex', gap: '10px' }}><span>📊</span> Dashboard</Link>
          <Link to="/admin/chat" style={{ padding: '0.8rem 1rem', color: 'var(--text)', textDecoration: 'none', borderRadius: '8px', display: 'flex', gap: '10px' }}><span>💬</span> Chat Inbox</Link>
          <Link to="/admin/orders" style={{ padding: '0.8rem 1rem', color: 'var(--text)', textDecoration: 'none', borderRadius: '8px', display: 'flex', gap: '10px' }}><span>📦</span> Orders</Link>
          <Link to="/admin/products" style={{ padding: '0.8rem 1rem', color: 'var(--text)', textDecoration: 'none', borderRadius: '8px', display: 'flex', gap: '10px' }}><span>🏷️</span> Products</Link>
          <Link to="/admin/customers" style={{ padding: '0.8rem 1rem', background: 'rgba(229,57,53,0.1)', color: 'var(--primary)', textDecoration: 'none', borderRadius: '8px', display: 'flex', gap: '10px' }}><span>👥</span> Customers</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '2rem' }}>Manage Customers</h2>

        <div style={{ background: '#12141a', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {registeredUsers?.length === 0 && <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No customers registered yet.</td></tr>}
              {registeredUsers?.map((c, i) => (
                <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>{c.name}</td>
                  <td style={{ padding: '1rem' }}>{c.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem',
                      background: c.role === 'admin' ? 'rgba(229,57,53,0.1)' : 'rgba(33,150,243,0.1)',
                      color: c.role === 'admin' ? 'var(--primary)' : '#2196f3'
                    }}>
                      {c.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
