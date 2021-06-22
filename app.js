require('dotenv').config();
const express = require("express");
const app = express();
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const methodOverride = require('method-override');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const pageRouter = require("./routes/pageRouter");
const contactFormRouter = require("./routes/contactFormRouter");
const { adminRouter } = require("./routes/adminRouter");
const adminBlogRouter = require('./routes/adminBlogRouter');
const initPassport = require("./passport-config");
initPassport(passport);

const Port = process.env.PORT || 8000

app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
require("./db/conn");
app.use(flash());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/admin', adminRouter);
app.use('/', adminBlogRouter);
app.use('/', contactFormRouter);
app.use('/', pageRouter);


app.listen(Port, () => console.log(`Listening to Port ${Port}`));