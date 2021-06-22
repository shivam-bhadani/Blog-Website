const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    name: { type: String },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['admin', 'user'] }
});

const User = mongoose.model('User', adminSchema);

module.exports = User;