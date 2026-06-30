import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import AdminSidebar from '../components/AdminSidebar';
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
      <AdminSidebar />

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#12141a' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>💬 Live Chat Inbox</h2>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {activeChats.filter(c => c.status === 'online').length} online · {activeChats.length} total conversations
          </p>
        </div>
        
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Customer List */}
          <div style={{ width: '280px', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', flexShrink: 0, background: '#0f1115' }}>
            <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Conversations ({activeChats.length})
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {activeChats.length === 0 && (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💤</div>
                  <p style={{ fontSize: '0.85rem' }}>No active customers</p>
                </div>
              )}
              {activeChats.map(chat => {
                const unreadMsgs = chatHistories[chat.id]?.filter(m => m.sender === 'user').length || 0;
                return (
                  <div 
                    key={chat.id} 
                    onClick={() => handleSelectChat(chat.id)}
                    style={{ 
                      padding: '0.8rem 1rem', 
                      borderBottom: '1px solid rgba(255,255,255,0.03)', 
                      cursor: 'pointer',
                      background: selectedChatId === chat.id ? 'rgba(229,57,53,0.08)' : 'transparent',
                      borderLeft: selectedChatId === chat.id ? '3px solid var(--primary)' : '3px solid transparent',
                      display: 'flex', gap: '10px', alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ 
                        width: '38px', height: '38px', borderRadius: '50%', 
                        background: `hsl(${chat.name.charCodeAt(0) * 7 % 360}, 60%, 45%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: '0.95rem', fontWeight: '700', color: '#fff'
                      }}>
                        {chat.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{
                        position: 'absolute', bottom: '0', right: '0',
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: chat.status === 'online' ? '#4caf50' : '#666',
                        border: '2px solid #0f1115'
                      }}></div>
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.name}</h4>
                        {chat.unread > 0 && (
                          <span style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.65rem', padding: '1px 6px', borderRadius: '10px', flexShrink: 0 }}>{chat.unread}</span>
                        )}
                      </div>
                      {chat.email && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>{chat.email}</div>}
                      <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {chat.lastMsg || '👋 Just joined'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Window */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.15)' }}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div style={{ padding: '0.8rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#12141a', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '42px', height: '42px', borderRadius: '50%', 
                    background: `hsl(${selectedChat.name.charCodeAt(0) * 7 % 360}, 60%, 45%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: '1.1rem', fontWeight: '700', color: '#fff', flexShrink: 0
                  }}>
                    {selectedChat.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', fontSize: '1rem' }}>{selectedChat.name}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.78rem', color: selectedChat.status === 'online' ? '#4caf50' : 'var(--text-muted)' }}>
                        {selectedChat.status === 'online' ? '🟢 Online now' : '⚪ Offline'}
                      </span>
                      {selectedChat.email && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>· {selectedChat.email}</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px' }}>
                    {currentMessages.length} messages
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, padding: '1rem 1.2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {currentMessages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
                      <p>No messages yet. Waiting for {selectedChat.name} to send a message...</p>
                    </div>
                  )}
                  {currentMessages.map(msg => (
                    <div key={msg.id} style={{
                      alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                      maxWidth: '65%'
                    }}>
                      {/* Sender label */}
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '3px', paddingLeft: msg.sender === 'admin' ? '0' : '4px', textAlign: msg.sender === 'admin' ? 'right' : 'left' }}>
                        {msg.sender === 'admin' ? '🛡️ You (Admin)' : `👤 ${selectedChat.name}`}
                      </div>
                      <div style={{
                        background: msg.sender === 'admin' 
                          ? 'linear-gradient(135deg, var(--primary), #c62828)' 
                          : '#1a1d24',
                        color: '#fff',
                        padding: '0.7rem 1rem',
                        borderRadius: msg.sender === 'admin' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        border: msg.sender === 'admin' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        wordBreak: 'break-word'
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '3px', textAlign: msg.sender === 'admin' ? 'right' : 'left', paddingLeft: msg.sender === 'admin' ? '0' : '4px' }}>
                        {msg.time}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{ padding: '0.8rem 1rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#12141a', display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`Reply to ${selectedChat.name}...`}
                    style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                    style={{ 
                      background: input.trim() ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      color: '#fff', border: 'none', padding: '0.75rem 1.5rem', 
                      borderRadius: '10px', fontWeight: '600', cursor: input.trim() ? 'pointer' : 'not-allowed',
                      fontSize: '0.9rem', transition: 'all 0.2s', opacity: input.trim() ? 1 : 0.5
                    }}
                  >
                    Send ➤
                  </button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '1rem' }}>
                <div style={{ fontSize: '4rem' }}>💬</div>
                <h3 style={{ margin: 0 }}>Select a conversation</h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Choose a customer from the left to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
