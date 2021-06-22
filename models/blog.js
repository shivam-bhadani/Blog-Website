const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);


const blogSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    urlSlug: { type: String, required: true },
    titleSlug: { type: String, unique: true },
    categorySlug: { type: String },
    keywords: { type: String },
    comments: [{
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid Email")
                }
            }
        },
        gravatarUrl: { type: String },
        date: { type: Date, default: Date.now },
        comment: { type: String },
        replies: [{
            name: { type: String, required: true },
            email: {
                type: String,
                required: true,
                validate(value) {
                    if (!validator.isEmail(value)) {
                        throw new Error("Invalid Email")
                    }
                }
            },
            gravatarUrl: { type: String },
            date: { type: Date, default: Date.now },
            reply: { type: String, required: true },
        }]
    }]
});

blogSchema.pre('validate', function (next) {
    if (this.title) {
        this.titleSlug = slugify(this.urlSlug, { lower: true, strict: true });
    }
    if (this.category) {
        this.categorySlug = slugify(this.category, { lower: true, strict: true })
    }

    if (this.content) {
        this.content = DOMPurify.sanitize(this.content);
    }
    next();
})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;