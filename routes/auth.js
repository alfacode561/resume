
const express = require('express');
const router = express.Router();
const db = require('../db'); // Import your db connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if the username already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insert = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const newUser = insert.run(username, hashedPassword);

    res.status(201).json({ success: true, message: 'User registered successfully' });
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Query the user
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, message: 'Login successful' });
});

module.exports = router;
