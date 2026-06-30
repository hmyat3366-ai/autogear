import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminOrders() {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();

  if (!user || user.role !== 'admin') {
    return <div style={{ textAlign: 'center', padding: '4rem' }}><h2>Access Denied</h2></div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#0a0b0e' }}>
      {/* Sidebar */}
      <AdminSidebar />

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
              {(!orders || orders.length === 0) && <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders yet. Go to Checkout to create one.</td></tr>}
              {orders && orders.map(order => (
                <tr key={order._id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{order._id}</td>
                  <td style={{ padding: '1rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    {order.customerName || 'Guest'}<br/>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.customerId || 'N/A'}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>${order.totalAmount}</td>
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
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
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
