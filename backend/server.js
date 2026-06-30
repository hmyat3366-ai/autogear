const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // For demo purposes allow all
    methods: ['GET', 'POST']
  }
});

// In-memory store for active users
// Record structure: { id: '...', name: 'User 1', lastMsg: '', unread: 0, status: 'online' }
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a normal user joins
  socket.on('user_join', (data) => {
    const userName = data?.name || `Customer-${socket.id.substring(0, 4)}`;
    activeUsers.set(socket.id, {
      id: socket.id,
      name: userName,
      status: 'online',
      lastMsg: '',
      unread: 0
    });
    
    console.log(`${userName} joined.`);
    // Broadcast updated user list to admins
    io.emit('admin_update_users', Array.from(activeUsers.values()));
  });

  // When user sends a message
  socket.on('user_send_message', (data) => {
    const user = activeUsers.get(socket.id);
    if (user) {
      user.lastMsg = data.text;
      user.unread += 1;
      
      const message = {
        id: Date.now(),
        text: data.text,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // Send to all admins
      io.emit('admin_receive_message', {
        userId: socket.id,
        message: message
      });
      // Update admin UI with new lastMsg/unread count
      io.emit('admin_update_users', Array.from(activeUsers.values()));
    }
  });

  // When admin sends a message to a user
  socket.on('admin_send_message', (data) => {
    const { userId, text } = data;
    const user = activeUsers.get(userId);
    if (user) {
      user.unread = 0; // reset unread count since admin replied
      // Send to specific user
      io.to(userId).emit('user_receive_message', {
        id: Date.now(),
        text: text,
        sender: 'admin',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      io.emit('admin_update_users', Array.from(activeUsers.values()));
    }
  });

  // When admin marks user as read (selects them)
  socket.on('admin_mark_read', (userId) => {
    const user = activeUsers.get(userId);
    if (user) {
      user.unread = 0;
      io.emit('admin_update_users', Array.from(activeUsers.values()));
    }
  });

  // Get initial users list for admin
  socket.on('admin_get_users', () => {
    socket.emit('admin_update_users', Array.from(activeUsers.values()));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (activeUsers.has(socket.id)) {
      const user = activeUsers.get(socket.id);
      user.status = 'offline';
      io.emit('admin_update_users', Array.from(activeUsers.values()));
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
