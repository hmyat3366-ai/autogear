import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const API_URL = 'http://localhost:3001/api';
  const SOCKET_URL = 'http://localhost:3001';

  // Fetch initial orders
  useEffect(() => {
    if (!user) return; // Only fetch if user is logged in
    
    fetch(`${API_URL}/orders`)
      .then(res => res.json())
      .then(data => {
        // If normal user, filter their orders only. If admin, see all.
        if (user.role === 'admin') {
          setOrders(data);
        } else {
          setOrders(data.filter(o => o.customerName === user.name || o.customerId === user.email));
        }
      })
      .catch(err => console.error('Failed to fetch orders:', err));
  }, [user]);

  // Real-time WebSocket Listeners
  useEffect(() => {
    const socket = io(SOCKET_URL);

    // When an order is added by someone
    socket.on('order_added', (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
    });

    // When admin updates an order status
    socket.on('order_status_updated', (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    });

    return () => socket.disconnect();
  }, []);

  const addOrder = async (orderData) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          customerId: user?.email,
          customerName: user?.name || orderData.shipping?.name
        })
      });
      const newOrder = await response.json();
      return newOrder;
    } catch (err) {
      console.error('Failed to place order:', err);
      return null;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};
