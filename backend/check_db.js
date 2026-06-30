const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await mongoose.connection.db.collection('users').findOne({ email: 'admin@test.com' });
    
    // Simulate login
    const password = '123';
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('isMatch:', isMatch);
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    console.log('Token:', token);
    
    mongoose.disconnect();
  } catch (e) {
    console.error('Error during login:', e);
  }
}

checkAdmin();
