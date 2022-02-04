const express = require('express');
const app = express();
 const blogsRoute = require("./routes/blogRoute");
 const adminRoute = require("./routes/adminRoute");
 const experienceRoute = require("./routes/experienceRoute");
 const feedbackRout = require("./routes/feedbackRoute")
 app.use(blogsRoute);
 app.use(adminRoute);
 app.use(experienceRoute);
 app.use(feedbackRout)
require('dotenv').config()

const mongoose = require('mongoose')
require("./db");

app.get('/', async (req, res) => {
    res.send({ status: 200, message: 'okay' })
})

app.listen(3002, () => {
    console.log("ok");
})