const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/kali_users', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('connected', () => console.log('MongoDB connected successfully'));
