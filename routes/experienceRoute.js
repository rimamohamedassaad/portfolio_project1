const express = require('express')
const experiencesRoute = express.Router();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Experiences = require('../model/experienceSchema')
experiencesRoute.use(bodyParser.urlencoded({ extended: true }));
experiencesRoute.use(bodyParser.json());
require('dotenv').config()


experiencesRoute.route('/experiences/read').get(async (req, res) => {
    await Experiences.find()
        .then(experience => {
            res.status(200).send({ status: 200, data: experience })
        })
        .catch(err => {
            res.status(422).send(err);
        })
})

experiencesRoute.route('/experiences/add').post(async (req, res) => {
    // let date = req.body.date;
    // let title = req.body.title;
    // let image = req.body.image;
    // let link = req.body.link;
    // let active = req.body.active;

    let title = req.body.title;
    let date_start = req.body.date_start;
    let date_end = req.body.date_end;
    let location = req.body.location;
    let description = req.body.description;
    let active = req.body.active;

    if (title && date_start && date_end && location && description && active) {

        Experiences.create({
            title: title,
            date_start: date_start,
            date_end: date_end,
            location: location,
            description: description,
            active: active
        })
            .then(experience => {
                res.status(200).send({ status: 200, data: experience })
            })
            .catch(err => res.status(422).send(err));
    }
})

experiencesRoute.route('/experiences/update/:id').put(async (req, res) => {
    let { id } = req.params;
    let { title , date_start , date_end , location , description , active } = req.body;


    let bodyOkay = date_start || title || date_end || location || description || active;
    if (!bodyOkay) return res.status(403).json({
        status: 403,
        error: true,
        message: 'you cannot update the blog'
    });
    else {
        let modifications = {}
        if (date_start) modifications.dadate_startte = date_start;
        if (title) modifications.title = title;
        if (date_end) modifications.date_end = date_end;
        if (location) modifications.location = location;
        if (description) modifications.description = description;
        if (active) modifications.active = active;

        await Experiences.findById(id)
            .then(experiences => {

                Experiences.updateOne({ _id: id },
                    { $set: modifications })
                    .then(updatedExperiences => {
                        if (!updatedExperiences) return res.status(404).send();

                        Blogs.find()
                            .then(experience => {
                                res.status(200).send({ status: 200, data: experience })
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
                res.status(404).send({ status: 404, error: true, message: `The expereiences ${req.params.id} does not exist` })
            })
    }

})


experiencesRoute.route("/experiences/delete/:id").delete(async (req, res) => {
    await Experiences.findOneAndDelete({ _id: req.params.id })
        .then(deleteexperiences => {
            if (!deleteexperiences) return res.status(404).send({ status: 404, error: true, message: `the experience does not exist` });
            Experiences.find()
                .then(experiences => {
                    res.status(200).send({ status: 200, data: experiences })
                })
                .catch(err => {
                    res.status(422).send(err);
                })
        })
        .catch(err => {
            res.status(422).send(err);
        })
})


module.exports = experiencesRoute; 