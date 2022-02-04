const express = require('express')
const blogsRoute = express.Router();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Blogs = require('../model/blogSchema')
blogsRoute.use(bodyParser.urlencoded({ extended: true }));
blogsRoute.use(bodyParser.json());
require('dotenv').config()

blogsRoute.route('/blogs/read').get(async (req, res) => {
    await Blogs.find()
        .then(blog => {
            res.status(200).send({ status: 200, data: blog })
        })
        .catch(err => {
            res.status(422).send(err);
        })
})

blogsRoute.route('/blogs/add').post(async (req, res) => {
    let date = req.body.date;
    let title = req.body.title;
    let image = req.body.image;
    let link = req.body.link;
    let active = req.body.active;
    if (date && title && image && link && active) {

        Blogs.create({
            date: date,
            title: title,
            image: image,
            link: link,
            active: active
        })
            .then(blog => {
                res.status(200).send({ status: 200, data: blog })
            })
            .catch(err => res.status(422).send(err));
    }
})

blogsRoute.route('/blogs/update/:id').patch(async (req, res) => {
    let { id } = req.params;
    let { date, title, image, link, active } = req.body;


    let bodyOkay = date || title || image || link || active;
    if (!bodyOkay) return res.status(403).json({
        status: 403,
        error: true,
        message: 'you cannot update the blog'
    });
    else {
        let modifications = {}
        if (date) modifications.date = date;
        if (title) modifications.title = title;
        if (image) modifications.image = image;
        if (link) modifications.link = link;
        if (active) modifications.active = active;

        await Blogs.findById(id)
            .then(blog => {

                Blogs.updateOne({ _id: id },
                    { $set: modifications })
                    .then(updatedBlog => {
                        if (!updatedBlog) return res.status(404).send();

                        Blogs.find()
                            .then(blog => {
                                res.status(200).send({ status: 200, data: blog })
                            })
                            .catch(err => {
                                res.status(422).send(err);
                            })

                    })

                    .catch(err => {
                        res.status(422).send(err);
                    })

            })
            .catch(err => {
                res.status(404).send({ status: 404, error: true, message: `The BLOG ${req.params.id} does not exist` })
            })
    }

})


blogsRoute.route("/blogs/delete/:id").delete(async (req, res) => {
    await Blogs.findOneAndDelete({ _id: req.params.id })
        .then(deleteblog => {
            if (!deleteblog) return res.status(404).send({ status: 404, error: true, message: `the blog does not exist` });
            Blogs.find()
                .then(blog => {
                    res.status(200).send({ status: 200, data: blog })
                })
                .catch(err => {
                    res.status(422).send(err);
                })
        })
        .catch(err => {
            res.status(422).send(err);
        })
})
module.exports = blogsRoute;

