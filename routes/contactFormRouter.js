const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Contact = require("../models/contact");

router.post("/contact", async (req, res) => {
    try {

        let contactUser = new Contact(req.body);
        let result = await contactUser.save();
        res.status(201).send(result);

    } catch (err) {
        console.log(err);
        res.redirect('/contact');
    }
})

module.exports = router;