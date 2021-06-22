const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    name : { type: String, required: true },
    email : { type: String, required: true, unique: true },
    subject : { type: String, required: true },
    message : { type: String, required: true },
    date : { type: Date, default: Date.now }
}, { timestamps : true } );

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;