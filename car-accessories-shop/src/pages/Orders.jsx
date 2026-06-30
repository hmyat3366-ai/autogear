import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';

export default function Orders() {
  const { orders } = useOrders();
  const [liveOrders, setLiveOrders] = useState([]);

  // Map admin status to tracking steps
  useEffect(() => {
    const updatedOrders = orders.map(order => {
      const statusLevel = {
        'confirmed': 0,
        'Processing': 1,
        'Shipped': 2,
        'Delivered': 3
      }[order.status] || 0;

      const newSteps = order.trackingSteps.map((step, idx) => {
        if (idx <= statusLevel) {
          return { ...step, done: true, time: step.time || new Date().toLocaleString() };
        }
        return { ...step, done: false, time: '' };
      });

      return { ...order, trackingSteps: newSteps };
    });
    
    setLiveOrders(updatedOrders);
  }, [orders]);

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="shop-header">
          <h1>My Orders</h1>
          <p>Track your orders and delivery status</p>
        </div>
        <div className="cart-empty">
          <span className="cart-empty-icon">📦</span>
          <p>No orders yet</p>
          <p className="cart-empty-sub">Start shopping to see your orders here!</p>
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="shop-header">
        <h1>My Orders</h1>
        <p>Track your orders and delivery status</p>
      </div>

      <div className="orders-list">
        {liveOrders.map((order, idx) => (
          <div key={idx} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order {order._id}</h3>
                <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div className="order-method-badge">
                {order.deliveryMethod === 'delivery' ? '🚚 Delivery' : '🏪 Take Away'}
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="tracking-timeline">
              {order.trackingSteps.map((step, si) => (
                <div key={si} className={`tracking-step ${step.done ? 'completed' : ''}`}>
                  <div className="tracking-dot">
                    {step.done ? '✓' : si + 1}
                  </div>
                  <div className="tracking-info">
                    <strong>{step.step}</strong>
                    <span>{step.time || 'Pending'}</span>
                  </div>
                  {si < order.trackingSteps.length - 1 && (
                    <div className={`tracking-line ${step.done ? 'completed' : ''}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Order Items */}
            <div className="order-items">
              {order.items.map(item => (
                <div key={item.id} className="order-item">
                  <span className="order-item-emoji">{item.img}</span>
                  <div>
                    <div>{item.name}</div>
                    <div className="order-item-qty">Qty: {item.quantity} × ${item.price}</div>
                  </div>
                  <span className="order-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div>
                <span className="order-est">
                  {order.deliveryMethod === 'delivery'
                    ? `📅 Estimated: ${order.estimatedDelivery}`
                    : `⚡ ${order.estimatedDelivery}`
                  }
                </span>
              </div>
              <div className="order-total">
                Total: <strong>${order.total.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
