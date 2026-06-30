require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Database!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- Database Schemas ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // 'user' or 'admin'
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

const OrderSchema = new mongoose.Schema({
  customerId: String, // email or ID
  customerName: String,
  items: Array,
  totalAmount: Number,
  paymentMethod: String,
  shippingAddress: Object,
  deliveryMethod: String,
  estimatedDelivery: String,
  trackingSteps: Array,
  status: { type: String, default: 'Processing' }, // Processing, Shipped, Delivered
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

const ChatMessageSchema = new mongoose.Schema({
  senderEmail: { type: String, required: true },
  senderName: String,
  text: { type: String, required: true },
  sender: { type: String, enum: ['user', 'admin'], required: true },
  createdAt: { type: Date, default: Date.now }
});
const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);

const jwt = require('jsonwebtoken');

// --- REST APIs for Authentication ---
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword, role: 'user' });
    await user.save();
    
    io.emit('new_customer_registered', user);
    
    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ message: 'User registered successfully', token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== user.password) { // Fallback for old unhashed passwords
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// --- REST APIs for Orders ---
app.get('/api/orders', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    
    // Emit WebSocket event so Admin sees it instantly!
    io.emit('order_added', order);
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    // Emit WebSocket event so Customer sees tracking update instantly!
    io.emit('order_status_updated', order);
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// --- REST API for Chat History ---
app.get('/api/chat/:email', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ senderEmail: req.params.email }).sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load chat history' });
  }
});

// --- WebSocket Logic (Chat & Real-time) ---
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a normal user joins
  socket.on('user_join', async (data) => {
    const userName = data?.name || `Customer-${socket.id.substring(0, 4)}`;
    const userEmail = data?.email || '';
    const userId = userEmail || socket.id; // Use email as unique ID to prevent duplicates

    socket.join(userId); // Join room so admin can send back via this ID

    const existingUser = activeUsers.get(userId) || { unread: 0, lastMsg: '' };

    activeUsers.set(userId, {
      id: userId,
      socketId: socket.id, // Store current socket ID
      name: userName,
      email: userEmail,
      status: 'online',
      lastMsg: existingUser.lastMsg,
      unread: existingUser.unread
    });
    
    // Load chat history for this user
    if (userEmail) {
      try {
        const history = await ChatMessage.find({ senderEmail: userEmail }).sort({ createdAt: 1 }).limit(100);
        socket.emit('chat_history', history);
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
    
    console.log(`${userName} joined.`);
    io.emit('admin_update_users', Array.from(activeUsers.values()));
  });

  // User sends message
  socket.on('user_send_message', async (data) => {
    // Find user by current socket.id
    let currentUser = null;
    for (let user of activeUsers.values()) {
      if (user.socketId === socket.id) {
        currentUser = user;
        break;
      }
    }

    if (currentUser) {
      currentUser.lastMsg = data.text;
      currentUser.unread += 1;
      
      const message = { id: Date.now(), text: data.text, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      
      // Save to database
      if (currentUser.email) {
        try {
          await ChatMessage.create({ senderEmail: currentUser.email, senderName: currentUser.name, text: data.text, sender: 'user' });
        } catch (e) { console.error('Save chat error:', e); }
      }
      
      io.emit('admin_receive_message', { userId: currentUser.id, message });
      io.emit('admin_update_users', Array.from(activeUsers.values()));
    }
  });

  // Admin sends message
  socket.on('admin_send_message', async (data) => {
    const { userId, text } = data;
    const user = activeUsers.get(userId);
    if (user) {
      user.unread = 0;
      
      // Save admin reply to database
      if (user.email) {
        try {
          await ChatMessage.create({ senderEmail: user.email, senderName: 'Admin', text, sender: 'admin' });
        } catch (e) { console.error('Save admin chat error:', e); }
      }
      
      io.to(userId).emit('user_receive_message', {
        id: Date.now(), text, sender: 'admin', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      io.emit('admin_update_users', Array.from(activeUsers.values()));
    }
  });

  socket.on('admin_mark_read', (userId) => {
    const user = activeUsers.get(userId);
    if (user) {
      user.unread = 0;
      io.emit('admin_update_users', Array.from(activeUsers.values()));
    }
  });

  socket.on('admin_get_users', () => {
    socket.emit('admin_update_users', Array.from(activeUsers.values()));
  });

  socket.on('disconnect', () => {
    for (let [userId, user] of activeUsers.entries()) {
      if (user.socketId === socket.id) {
        user.status = 'offline';
        io.emit('admin_update_users', Array.from(activeUsers.values()));
        break;
      }
    }
  });
});

// Ensure a default Admin user exists in DB
async function seedAdmin() {
  const adminExists = await User.findOne({ email: 'admin@test.com' });
  if (!adminExists) {
    await User.create({ name: 'Admin', email: 'admin@test.com', password: '123', role: 'admin' });
    console.log('✅ Default Admin user created (admin@test.com / 123)');
  }
}
mongoose.connection.once('open', seedAdmin);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Real-time Backend running on port ${PORT}`);
});
