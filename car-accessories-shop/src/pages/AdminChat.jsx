import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

let socket;

export default function AdminChat() {
  const { user } = useAuth();
  
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [input, setInput] = useState('');
  
  // Store messages per user ID: { 'socketId1': [ {id, text, sender, time} ] }
  const [chatHistories, setChatHistories] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket = io('https://autogear-api.onrender.com');

    socket.on('connect', () => {
      console.log('Admin connected to chat server');
      socket.emit('admin_get_users');
    });

    socket.on('admin_update_users', (users) => {
      setActiveChats(users);
    });

    socket.on('admin_receive_message', (data) => {
      const { userId, message } = data;
      setChatHistories(prev => ({
        ...prev,
        [userId]: [...(prev[userId] || []), message]
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistories, selectedChatId]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-page" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Access Denied</h2>
        <p>You must be an admin to view this page.</p>
      </div>
    );
  }

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    socket.emit('admin_mark_read', chatId);
  };

  const handleSendMessage = () => {
    if (!input.trim() || !selectedChatId) return;
    
    const newMsg = {
      id: Date.now(),
      text: input,
      sender: 'admin',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Add to local history
    setChatHistories(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg]
    }));

    // Send to server
    socket.emit('admin_send_message', {
      userId: selectedChatId,
      text: input
    });
    
    setInput('');
  };

  const selectedChat = activeChats.find(c => c.id === selectedChatId);
  const currentMessages = selectedChatId ? (chatHistories[selectedChatId] || []) : [];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#0a0b0e' }}>
      {/* Sidebar Navigation */}
      <div style={{ width: '280px', background: '#12141a', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--primary)', color: '#fff', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>AG</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Admin Portal</h2>
            <span style={{ fontSize: '0.75rem', color: '#4caf50' }}>● System Online</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link to="/admin" style={{ padding: '0.8rem 1rem', color: 'var(--text)', textDecoration: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }} onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.target.style.background = 'transparent'}>
            <span>📊</span> Dashboard
          </Link>
          <Link to="/admin/chat" style={{ padding: '0.8rem 1rem', background: 'rgba(229,57,53,0.1)', color: 'var(--primary)', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>💬</span> Live Chat Inbox
          </Link>
          <Link to="/admin/orders" style={{ padding: '0.8rem 1rem', color: 'var(--text)', textDecoration: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}><span>📦</span> Orders</Link>
          <Link to="/admin/products" style={{ padding: '0.8rem 1rem', color: 'var(--text)', textDecoration: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}><span>🏷️</span> Products</Link>
          <Link to="/admin/customers" style={{ padding: '0.8rem 1rem', color: 'var(--text)', textDecoration: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}><span>👥</span> Customers</Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ margin: '0 0 1rem 0' }}>Live Chat Dashboard</h2>
        
        <div className="admin-chat-container" style={{ display: 'flex', flex: 1, background: '#12141a', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
          
          {/* Left Sidebar - Active Customers */}
          <div className="chat-sidebar" style={{ width: '300px', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 'bold' }}>Active Customers ({activeChats.length})</div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {activeChats.length === 0 && <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No active customers</div>}
              {activeChats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`chat-user-item ${selectedChatId === chat.id ? 'active' : ''}`}
                  onClick={() => handleSelectChat(chat.id)}
                  style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid rgba(255,255,255,0.05)', 
                    cursor: 'pointer',
                    background: selectedChatId === chat.id ? 'rgba(229,57,53,0.1)' : 'transparent',
                    display: 'flex', gap: '10px', alignItems: 'center'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {chat.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{chat.name}</h4>
                      {chat.unread > 0 && (
                        <span style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px' }}>{chat.unread}</span>
                      )}
                    </div>
                    <p style={{ margin: '0', fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {chat.lastMsg || 'Joined the chat'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Area - Chat Window */}
          <div className="chat-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' }}>
            {selectedChat ? (
              <>
                <div className="chat-header" style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#12141a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {selectedChat.name.charAt(0)}
                  </div>
                  <div>
                    <strong style={{ display: 'block' }}>{selectedChat.name}</strong>
                    <span style={{ fontSize: '0.8rem', color: selectedChat.status === 'online' ? '#4caf50' : 'var(--text-muted)' }}>
                      {selectedChat.status === 'online' ? '🟢 Online' : '⚪ Offline'}
                    </span>
                  </div>
                </div>

                <div className="chat-messages" style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {currentMessages.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No messages yet.</div>}
                  {currentMessages.map(msg => (
                    <div key={msg.id} style={{
                      alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                      maxWidth: '70%'
                    }}>
                      <div style={{
                        background: msg.sender === 'admin' ? 'var(--primary)' : '#12141a',
                        color: '#fff',
                        padding: '0.75rem 1rem',
                        borderRadius: msg.sender === 'admin' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                        border: msg.sender === 'admin' ? 'none' : '1px solid rgba(255,255,255,0.05)'
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: msg.sender === 'admin' ? 'right' : 'left' }}>
                        {msg.time}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area" style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#12141a', display: 'flex', gap: '1rem' }}>
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your reply..."
                    style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="btn-primary" 
                    style={{ padding: '0 1.5rem', borderRadius: '8px' }}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <h3>Select a conversation to start messaging</h3>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
