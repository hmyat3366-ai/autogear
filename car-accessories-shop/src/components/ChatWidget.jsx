import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

let socket;

export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'AutoGear မှ ကြိုဆိုပါတယ်ခင်ဗျာ! 🚗 ဒီနေ့ ဘာများကူညီပေးရမလဲ?', sender: 'admin', time: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socket = io('https://autogear-api.onrender.com');

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('user_join', { name: user?.name || 'Guest User' });
    });

    socket.on('user_receive_message', (msg) => {
      // Need to parse string time back to a real Date or just use the string.
      // The server sends time as a string. Let's just store it.
      setMessages(prev => [...prev, { ...msg, time: new Date() }]);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    
    if (isConnected) {
      socket.emit('user_send_message', { text: input });
    }
    
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {isOpen && (
        <div className="chat-widget">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">AG</div>
              <div>
                <strong>AutoGear Support</strong>
                <div className="chat-status">{isConnected ? '🟢 Online' : '⚪ Connecting...'}</div>
              </div>
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {messages.map(msg => (
              <div key={msg.id} className={`msg ${msg.sender === 'user' ? 'sent' : 'received'}`}>
                <div className="msg-text">{msg.text}</div>
                <div className="msg-time">{formatTime(msg.time)}</div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="ဒီမှာ စာရိုက်ပါ..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={sendMessage} disabled={!input.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        className={`chat-fab ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <span className="chat-fab-icon">💬</span>
        <span className="chat-fab-pulse"></span>
      </button>
    </>
  );
}
