
const mongoose = require('mongoose')
const blogsSchema = new mongoose.Schema({
    date: Date, 
    title: String,
    image:String,
    link:String,
    active:Boolean
});
module.exports = mongoose.model("Blogs", blogsSchema);