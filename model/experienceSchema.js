const mongoose = require('mongoose')
const experienceSchema = new mongoose.Schema({
    title: String,
    date_start: Date,
    date_end:Date,
    location: [String],
    description: String
});
module.exports = mongoose.model("Experience", experienceSchema);