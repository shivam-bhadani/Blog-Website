const express = require('express');
const router = express.Router();
const path = require('path');
const Blog = require('../models/blog');

const { checkAdminAuthentication, checkAuthenticated } = require('./adminRouter');


const thumbnailPath = path.join(__dirname, '../public/thumbnail');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: thumbnailPath,
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage });

router.get('/admin/blog', checkAuthenticated, checkAdminAuthentication, async (req, res) => {
    let blogs = await Blog.find().sort({ date: -1 });
    res.render('adminBlog', { user: req.user, blogs });
})


router.post('/admin/blog', checkAuthenticated, checkAdminAuthentication, upload.single('thumbnail'), async (req, res) => {
    let title = req.body.title;
    let urlSlug = req.body.urlSlug;
    let description = req.body.description;
    let keywords = req.body.keywords;
    let thumbnail = req.file.originalname;
    let category = req.body.category;
    let content = req.body.content;

    try {

        let blog = new Blog({
            title,
            urlSlug,
            description,
            keywords,
            thumbnail,
            category,
            content
        })
        await blog.save();
        res.redirect('/admin/blog');

    } catch (error) {
        console.log(error);
        res.redirect('/admin/new-post');
    }
});

router.get('/admin/edit-post/:id', checkAuthenticated, checkAdminAuthentication, async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);
        res.render('blogPostForm', { blog, pageTitle: "Edit Post", user: req.user, btnType: "Edit", formAction: `/admin/blog/${req.params.id}?_method=PUT`, enctype: "" });
    } catch (error) {
        console.log(error);
    }
})

router.put('/admin/blog/:id', checkAuthenticated, checkAdminAuthentication, async (req, res) => {
    try {

        await Blog.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            keywords: req.body.keywords,
            category: req.body.category,
            content: req.body.content
        })

        res.redirect('/admin/blog')

    } catch (error) {
        console.log(error);
        res.redirect('/admin/blog')
    }
})

router.delete('/admin/blog/:id', checkAuthenticated, checkAdminAuthentication, async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.redirect('/admin/blog');

    } catch (err) {
        console.log(err);
        res.redirect('/admin/blog')
    }
})


module.exports = router;