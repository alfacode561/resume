const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const messagesRouter = require('./routes/messages');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(cors());

// Database connection






mongoose.connect('mongodb://localhost:27017/userdb')
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error:', err));
// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    securityQuestion: { type: String, required: true },
    securityAnswer: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRouter);

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {


  try {
    const { username, email, password, securityQuestion, securityAnswer } = req.body;
    










    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already exists' 
      });
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }
    

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    





    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      securityQuestion,
      securityAnswer
    });
    
    await user.save();
    
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
// Serve the registration page
app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'register.html'));
});

// Start server
app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
});