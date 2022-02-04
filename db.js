const mongoose = require('mongoose')
const URI = process.env.DBCONNECTION;
module.exports = mongoose.connect(URI, {useNewUrlParser:true}, err => {
    if (err) throw err;
    console.log("connected successfully");
})