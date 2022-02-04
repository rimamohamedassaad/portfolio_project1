
const mongoose = require('mongoose')
const adminSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    password: String,
    email: String,
    profile : String,
    image:String,
    phone: Number,
    about: String,
    github: String,
    linkedin:String
});
module.exports = mongoose.model("Admin", adminSchema);