const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        const newMessage = new Message({
            name,
            email,
            message
        });

        await newMessage.save();

        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
});

module.exports = router;
