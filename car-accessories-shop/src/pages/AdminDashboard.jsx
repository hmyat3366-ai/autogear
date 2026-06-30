import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-page" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Access Denied</h2>
        <p>You must be an admin to view this page.</p>
        <Link to="/admin-login" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}>Go to Admin Login</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#0a0b0e' }}>
      
      {/* Sidebar */}
      <div style={{ width: '280px', background: '#12141a', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
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
          <Link to="/admin" style={{ padding: '0.8rem 1rem', background: 'rgba(229,57,53,0.1)', color: 'var(--primary)', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📊</span> Dashboard
          </Link>
          <Link to="/admin/chat" style={{ padding: '0.8rem 1rem', color: 'var(--text)', textDecoration: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }} onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.target.style.background = 'transparent'}>
            <span>💬</span> Live Chat Inbox
          </Link>
          <Link to="/admin/orders" style={{ padding: '0.8rem 1rem', color: 'var(--text)', textDecoration: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }} onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.target.style.background = 'transparent'}>
            <span>📦</span> Orders
          </Link>
          <Link to="/admin/products" style={{ padding: '0.8rem 1rem', color: 'var(--text)', textDecoration: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }} onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.target.style.background = 'transparent'}>
            <span>🏷️</span> Products
          </Link>
          <Link to="/admin/customers" style={{ padding: '0.8rem 1rem', color: 'var(--text)', textDecoration: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }} onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.target.style.background = 'transparent'}>
            <span>👥</span> Customers
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              👤
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
            </div>
          </div>
          <button onClick={logout} style={{ width: '100%', padding: '0.6rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text)', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.target.style.background = 'transparent'}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>Overview</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Welcome back, {user.name}. Here's what's happening today.</p>
          </div>
          <div style={{ background: '#12141a', padding: '0.6rem 1.2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
            📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'Total Revenue', value: '$12,450.00', trend: '+15%', trendUp: true, icon: '💰' },
            { label: 'Active Orders', value: '45', trend: '+5%', trendUp: true, icon: '📦' },
            { label: 'Total Customers', value: '1,204', trend: '+12%', trendUp: true, icon: '👥' },
            { label: 'Pending Chats', value: '3', trend: '-2', trendUp: false, icon: '💬', link: '/admin/chat' }
          ].map((stat, i) => (
            <div key={i} style={{ background: '#12141a', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</span>
                <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{stat.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: stat.trendUp ? '#4caf50' : '#f44336', background: stat.trendUp ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {stat.trend}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>vs last week</span>
              </div>
              {stat.link && (
                <Link to={stat.link} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
              )}
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div style={{ background: '#12141a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Recent Orders</h3>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>View All</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>Order ID</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>Customer</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>Amount</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'ORD-8091', name: 'Aung Aung', date: 'Today, 2:30 PM', amount: '$120.00', status: 'Processing' },
                { id: 'ORD-8090', name: 'Kyaw Swar', date: 'Today, 11:15 AM', amount: '$45.50', status: 'Shipped' },
                { id: 'ORD-8089', name: 'Su Myat', date: 'Yesterday', amount: '$310.00', status: 'Delivered' },
              ].map((order, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{order.id}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{order.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{order.date}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>{order.amount}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      background: order.status === 'Delivered' ? 'rgba(76,175,80,0.1)' : order.status === 'Processing' ? 'rgba(255,152,0,0.1)' : 'rgba(33,150,243,0.1)',
                      color: order.status === 'Delivered' ? '#4caf50' : order.status === 'Processing' ? '#ff9800' : '#2196f3'
                    }}>
                      {order.status}
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
