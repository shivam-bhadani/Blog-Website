const mongoose = require('mongoose');

const newsletterSchema = mongoose.Schema({
    email: { type: String, requred: true, unique: true },
    date: { type: Date, default: Date.now }
});

const Newsletter = mongoose.model('newsletter', newsletterSchema);

module.exports = Newsletter;