import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { Link } from 'react-router-dom';

export default function AdminOrders() {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();

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
          <Link to="/admin/orders" style={{ padding: '0.8rem 1rem', background: 'rgba(229,57,53,0.1)', color: 'var(--primary)', textDecoration: 'none', borderRadius: '8px', display: 'flex', gap: '10px' }}><span>📦</span> Orders</Link>
          <Link to="/admin/products" style={{ padding: '0.8rem 1rem', color: 'var(--text)', textDecoration: 'none', borderRadius: '8px', display: 'flex', gap: '10px' }}><span>🏷️</span> Products</Link>
          <Link to="/admin/customers" style={{ padding: '0.8rem 1rem', color: 'var(--text)', textDecoration: 'none', borderRadius: '8px', display: 'flex', gap: '10px' }}><span>👥</span> Customers</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '2rem' }}>Manage Orders</h2>

        <div style={{ background: '#12141a', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th style={{ padding: '1rem' }}>Order ID</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Customer Info</th>
                <th style={{ padding: '1rem' }}>Total</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders yet. Go to Checkout to create one.</td></tr>}
              {orders.map(order => (
                <tr key={order.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{order.id}</td>
                  <td style={{ padding: '1rem' }}>{new Date(order.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    {order.customer?.fullName || 'Guest'}<br/>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.customer?.email || 'N/A'}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>${order.total}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem',
                      background: order.status === 'Processing' ? 'rgba(255,152,0,0.1)' : order.status === 'Shipped' ? 'rgba(33,150,243,0.1)' : 'rgba(76,175,80,0.1)',
                      color: order.status === 'Processing' ? '#ff9800' : order.status === 'Shipped' ? '#2196f3' : '#4caf50'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      value={order.status} 
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.4rem', borderRadius: '6px' }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
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
