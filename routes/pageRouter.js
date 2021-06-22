const express = require("express");
const router = express.Router();
const Blog = require('../models/blog');
const slugify = require('slugify');
const moment = require('moment');
const gravatar = require('gravatar');
let Newsletter = require('../models/newsletter');


router.get("/", searchMiddleware, async (req, res) => {
    try {
        let blogs = await Blog.find().sort({ date: -1 });

        blogs.forEach(blog => {
            blog.createdAt = moment(blog.date).format('MMMM DD, YYYY');
            blog.commentNo = blog.comments.length + replyLength(blog.comments);
        })

        let footerBlogs = await Blog.find().sort({ date: -1 }).limit(3);
        let categories = getCategories(blogs);

        res.render("blog", { blogs, category: 'Blog', categories, footerBlogs });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/blog', (req, res) => {
    res.redirect('/');
})

router.get("/about-me", async (req, res) => {
    try {
        let footerBlogs = await Blog.find().sort({ date: -1 }).limit(3);
        res.render("about", { footerBlogs });
    } catch (error) {
        console.log(error);
        res.redirect('/blog');
    }
});

router.get("/contact-me", async (req, res) => {
    try {
        let footerBlogs = await Blog.find().sort({ date: -1 }).limit(3);
        res.render("contact", { footerBlogs });
    } catch (error) {
        console.log(error);
        res.redirect('/blog');
    }
});

router.get('/blog/:titleSlug', async (req, res) => {
    try {
        let blog = await Blog.findOne({ titleSlug: req.params.titleSlug });
        blog.createdAt = moment(blog.date).format('MMMM DD, YYYY');
        blog.commentNo = blog.comments.length + replyLength(blog.comments);
        let footerBlogs = await Blog.find().sort({ date: -1 }).limit(3);
        let blogs = await Blog.find().sort({ date: -1 });
        blogs.forEach(blog => {
            blog.createdAt = moment(blog.date).format('MMMM DD, YYYY');
            blog.commentNo = blog.comments.length + replyLength(blog.comments);
        })
        let comments = await Blog.findOne({ titleSlug: req.params.titleSlug }).select({ _id: 0, comments: 1 })
        comments.comments.forEach(comment => {
            comment.createdAt = moment(comment.date).format('MMMM DD YYYY [At] h:mm A')
            comment.replies.forEach(reply => {
                reply.createdAt = moment(comment.date).format('MMMM DD YYYY [At] h:mm A')
            })
        })
        let categories = getCategories(blogs);
        res.render('show', { blog, categories, blogs, footerBlogs, comments: comments.comments, action: `/comment/${blog.id}?_method=PUT` });
    } catch (error) {
        console.log(error);
        res.redirect('/blog');
    }
});

router.post('/newsletter', async (req, res) => {
    {
        try {

            let subscriber = new Newsletter({
                email: req.body.email
            });

            await subscriber.save();
            res.redirect('/blog');

        } catch (error) {
            console.log(error);
            res.redirect('/blog');
        }
    }
})

router.get('/category/:categorySlug', async (req, res) => {
    try {
        let blogs = await Blog.find({ categorySlug: req.params.categorySlug });
        let footerBlogs = await Blog.find().sort({ date: -1 }).limit(3);
        let allBlogs = await Blog.find();
        let categories = getCategories(allBlogs);
        res.render('blog', { blogs, category: blogs[0].category, categories, footerBlogs });
    } catch (error) {
        console.log(error);
        res.redirect('/blog');
    }
});

router.put('/comment/:id', async (req, res) => {

    gravatarUrl = getGravatarUrl(req.body.email, 74);

    try {

        let comment = {
            name: req.body.name,
            email: req.body.email,
            comment: req.body.commentBody,
            gravatarUrl
        }



        let blog = await Blog.findByIdAndUpdate(req.params.id, {
            $push: {
                comments: comment
            }
        })
        res.redirect(`/blog/${blog.titleSlug}#comment`);

        // res.redirect(`/blog/${req.params.id}`);

    } catch (error) {
        console.log(error);
        res.redirect(`/blog/${blog.titleSlug}#comment`);
    }


})


router.put('/reply/:blogId/:commentId', async (req, res) => {

    gravatarUrl = getGravatarUrl(req.body.email, 55);

    try {

        await Blog.updateOne({ "_id": req.params.blogId, "comments._id": req.params.commentId }, {
            $push: {
                "comments.$.replies": {
                    name: req.body.name,
                    email: req.body.email,
                    reply: req.body.commentBody,
                    gravatarUrl
                }
            }
        })
        let blog = await Blog.findById(req.params.blogId);
        res.redirect(`/blog/${blog.titleSlug}#comment`);

    } catch (error) {
        console.log(error);
        res.redirect(`/blog/${blog.titleSlug}#comment`);
    }

})

router.use(async (req, res, next) => {
    try {
        let blogs = await Blog.find().sort({ date: -1 });

        blogs.forEach(blog => {
            blog.createdAt = moment(blog.date).format('MMMM DD, YYYY');
            blog.commentNo = blog.comments.length + replyLength(blog.comments);
        })

        let footerBlogs = await Blog.find().sort({ date: -1 }).limit(3);
        let categories = getCategories(blogs);

        res.status(404).render("error404", { blogs, category: 'Blog', categories, footerBlogs });
    } catch (error) {
        console.log(error);
        res.status(404).render("error404", { blogs, category: 'Blog', categories, footerBlogs });
    }
})

function getCategories(blogs) {
    let categories = [];
    blogs.forEach((blog) => {
        categories.push(blog.category)
    });
    categories.sort();
    let uniqueCategories = [];
    for (let i = 0; i < categories.length; i++) {
        while (i < categories.length - 1 && categories[i] == categories[i + 1])
            i++;
        uniqueCategories.push(categories[i]);
    }
    categories = [];
    uniqueCategories.forEach(uniqueCategory => {
        let categorySlug = slugify(uniqueCategory, { lower: true, strict: true });
        categories.push({ categorySlug, uniqueCategory })
    })
    return categories;
}


function replyLength(comments) {
    let replyCount = 0;
    comments.forEach(comment => {
        replyCount = replyCount + comment.replies.length;
    })
    return replyCount;
}


function getGravatarUrl(email, size) {
    let options = {
        s: size,
        r: 'pg',
        d: 'mm'
    }
    let gravatarUrl = gravatar.url(email, options);
    return gravatarUrl;
}

async function searchMiddleware(req, res, next) {

    if (req.query.search) {

        let blogs = await Blog.find({ title: { $regex: req.query.search, $options: '$i' } })
        let allBlogs = await Blog.find();

        blogs.forEach(blog => {
            blog.createdAt = moment(blog.date).format('MMMM DD, YYYY');
            blog.commentNo = blog.comments.length + replyLength(blog.comments);
        })

        let footerBlogs = await Blog.find().sort({ date: -1 }).limit(3);
        let categories = getCategories(allBlogs);

        let category = `${blogs.length} Results found for: "${req.query.search}"`

        res.render("blog", { blogs, category, categories, footerBlogs });
        res.end();
    }
    else
        return next();
}

module.exports = router;