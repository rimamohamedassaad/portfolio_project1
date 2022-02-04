const mongoose = require('mongoose')
const feedbackSchema = new mongoose.Schema({
    dateFeedback: Date,
            text: String,
            visitorFirstName: String,
            visitorLastName: String,
            visitorImage: String,
            active: Boolean
});
module.exports = mongoose.model("Feedback", feedbackSchema);