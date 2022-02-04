const express = require('express')
const feedbacksRoute = express.Router();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Feedbacks = require('../model/feedbackSchema')
feedbacksRoute.use(bodyParser.urlencoded({ extended: true }));
feedbacksRoute.use(bodyParser.json());
require('dotenv').config();

feedbacksRoute.route('/feedbacks/read').get(async (req, res) => {
    await Feedbacks.find()
        .then(feedback => {
            res.status(200).send({ status: 200, data: feedback })
        })
        .catch(err => {
            res.status(422).send(err);
        })
})
feedbacksRoute.route('/feedbacks/add').post(async (req, res) => {
    let dateFeedback = req.body.dateFeedback;
    let text = req.body.text;
    let visitorFirstName = req.body.visitorFirstName;
    let visitorLastName = req.body.visitorLastName;
    let visitorImage = req.body.visitorImage;
    let active = req.body.active;

    if (dateFeedback && text && visitorFirstName && visitorLastName && visitorImage && active) {

        Feedbacks.create({
            dateFeedback: dateFeedback,
            text: text,
            visitorFirstName: visitorFirstName,
            visitorLastName: visitorLastName,
            visitorImage: visitorImage,
            active: active
        })
            .then(feedback => {
                res.status(200).send({ status: 200, data: feedback })
            })
            .catch(err => res.status(422).send(err));
    }
})

feedbacksRoute.route('/feedbacks/update/:id').patch(async (req, res) => {
    let { id } = req.params;
    let { dateFeedback, text, visitorFirstName, visitorLastName, visitorImage, active } = req.body;


    let bodyOkay = dateFeedback || text || visitorFirstName || visitorLastName || visitorImage || active;
    if (!bodyOkay) return res.status(403).json({
        status: 403,
        error: true,
        message: 'you cannot update the feedback'
    });
    else {
        let modifications = {}
        if (dateFeedback) modifications.dateFeedback = dateFeedback;
        if (text) modifications.text = text;
        if (visitorFirstName) modifications.visitorFirstName = visitorFirstName;
        if (visitorLastName) modifications.visitorLastName = visitorLastName;
        if (visitorImage) modifications.visitorImage = visitorImage;
        if (active) modifications.active = active;

        await Feedbacks.findById(id)
            .then(feedback => {

                Feedbacks.updateOne({ _id: id },
                    { $set: modifications })
                    .then(updateFeedback => {
                        if (!updateFeedback) return res.status(404).send();

                        Feedbacks.find()
                            .then(feedback => {
                                res.status(200).send({ status: 200, data: feedback })
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
                res.status(404).send({ status: 404, error: true, message: `The Feedback ${req.params.id} does not exist` })
            })
    }

})

feedbacksRoute.route("/feedbacks/delete/:id").delete(async (req, res) => {
    await Feedbacks.findOneAndDelete({ _id: req.params.id })
        .then(deletefeedback => {
            if (!deletefeedback) return res.status(404).send({ status: 404, error: true, message: `the feedback does not exist` });
            Feedbacks.find()
                .then(feedback => {
                    res.status(200).send({ status: 200, data: feedback })
                })
                .catch(err => {
                    res.status(422).send(err);
                })
        })
        .catch(err => {
            res.status(422).send(err);
        })
})

module.exports = feedbacksRoute;

