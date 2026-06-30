import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const API_URL = 'https://autogear-api.onrender.com/api';

export default function AdminDashboard() {
  const { user, logout, registeredUsers } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetch(`${API_URL}/orders`)
        .then(res => res.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(err => console.error('Failed to fetch orders:', err));
    }
  }, [user]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeOrders = orders.filter(o => o.status === 'Processing').length;
  const totalCustomers = registeredUsers?.length || 0;

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
      <AdminSidebar />

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
            { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString('en-US', {minimumFractionDigits:2})}`, trend: `${orders.length} orders`, trendUp: true, icon: '💰' },
            { label: 'Active Orders', value: `${activeOrders}`, trend: 'Processing', trendUp: activeOrders > 0, icon: '📦' },
            { label: 'Total Customers', value: `${totalCustomers}`, trend: 'Registered', trendUp: true, icon: '👥' },
            { label: 'Live Chat', value: '💬', trend: 'Open Inbox', trendUp: true, icon: '💬', link: '/admin/chat' }
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
            <Link to="/admin/orders" style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none' }}>View All →</Link>
          </div>
          {orders.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
              <p>No orders yet. Orders will appear here in real-time.</p>
            </div>
          ) : (
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
                {orders.slice(0, 5).map((order, i) => (
                  <tr key={order._id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{order._id ? `ORD-${order._id.slice(-4).toUpperCase()}` : `ORD-${i}`}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{order.customerName || 'Unknown'}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>${(order.totalAmount || 0).toFixed(2)}</td>
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
          )}
        </div>

      </div>
    </div>
  );
}
