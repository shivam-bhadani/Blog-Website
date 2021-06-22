const express = require("express");
const passport = require("passport");
const router = express.Router();
const Blog = require('../models/blog');
const bcrypt = require('bcrypt');
const User = require('../models/user')


router.get("/", checkNotAuthenticated, (req, res) => {
    res.render("admin");
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/admin/blog',
    failureRedirect: '/admin',
    failureFlash: true
}));

// router.get('/dashboard', checkAuthenticated, checkAdminAuthentication, (req, res) => {
//     res.render('dashboard', { user: req.user });
// })

router.get("/new-post", checkAuthenticated, checkAdminAuthentication, (req, res) => {
    let blog = new Blog();
    res.render("blogPostForm", { user: req.user, pageTitle: "New Post", blog, btnType: "Post", formAction: "/admin/blog", enctype: "multipart/form-data" });
});

router.get('/comment', checkAuthenticated, checkAdminAuthentication, async (req, res) => {
    let blogs = await Blog.find().sort({ date: -1 });
    res.render('adminComment', { user: req.user, blogs });
})

router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else
        res.redirect('/');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/admin/blog');
    }
    else
        return next();
}

function checkAdminAuthentication(req, res, next) {
    if (req.user.role === "admin") {
        return next();
    }
    else
        res.redirect('/');
}


module.exports = {
    adminRouter: router,
    checkAdminAuthentication,
    checkAuthenticated
};