const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('dotenv').config();

async function fixAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123', salt);
    
    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: 'admin@test.com' },
      { $set: { password: hashedPassword } }
    );
    
    console.log('Update result:', result);
    mongoose.disconnect();
  } catch (e) {
    console.error(e);
  }
}

fixAdminPassword();
