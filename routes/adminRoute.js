const express = require ('express')
const adminRoute = express.Router();
const bodyParser = require ('body-parser')
const mongoose = require('mongoose')
const Admin = require('../model/adminSchema')
adminRoute.use(bodyParser.urlencoded({ extended: true }));
adminRoute.use(bodyParser.json());
require('dotenv').config()

adminRoute.route('/admin/read').get(async (req, res) => {
    await Admin.find()
     .then(admin => {
         res.status(200).send({status:200, data: admin})
     })
     .catch(err => {
         res.status(422).send(err);
     })
 })

adminRoute.route('/admin/add').post( async(req,res) =>{
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let password = req.body.password;
    let email = req.body.email;
    let profile = req.body.profile;
    let image = req.body.image;
    let phone = req.body.phone;
    let about = req.body.about;
    let github = req.body.github;
    let linkedin = req.body.linkedin;
    if (first_name && last_name && password && email &&  profile && image && phone && about && github && linkedin) {

        Admin.create({
    first_name: first_name,
    last_name: last_name,
    password: password,
    email: email,
    profile : profile,
    image:image,
    phone: phone,
    about: about,
    github: github,
    linkedin:linkedin
})
    .then(admin => {
        res.status(200).send({status:200, data: admin})
    })
    .catch(err => res.status(422).send(err));
}
 })
 adminRoute.route('/admin/update/:id' ).put( async(req,res) =>{ 
    let { id } = req.params;
    let { first_name , last_name , password , email ,  profile , image , phone , about , github , linkedin  } = req.body;

    let bodyOkay = first_name || last_name || password || email || profile || image || phone || about || github || linkedin;
    if (!bodyOkay) return res.status(403).json({
        status: 403,
        error: true,
        message: 'you cannot update the admin'
    });
    else{
        let modifications = {}
    if (first_name) modifications.first_name = first_name;
    if (last_name) modifications.last_name = last_name;
    if (password) modifications.password = password;
    if (email) modifications.email = email;
    if (profile) modifications.profile = profile;
    if (image) modifications.image = image; 
    if (phone) modifications.phone = phone;
    if (about) modifications.about = about;
    if (github) modifications.github = github;
    if (linkedin) modifications.linkedin = linkedin;
      await  Admin.findById(id)
            .then(admin => {

Admin.updateOne({_id: id},
   { $set: modifications })
                    .then(updatedAdmin => {
                        if(!updatedAdmin) return res.status(404).send();

                        Admin.find()
                            .then(admin =>{
                                res.status(200).send({status:200, data: admin})
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
                res.status(404).send({status:404, error:true, message:`The Admin ${req.params.id} does not exist`})
            })
    }
    
 })



 adminRoute.route("/admin/delete/:id").delete(async(req, res) => {
    await Admin.findOneAndDelete({ _id: req.params.id })
         .then(deleteAdmin => {
             if (!deleteAdmin) return res.status(404).send({ status: 404, error: true, message: `the admin does not exist` });
             Admin.find()
                 .then(admin => {
                     res.status(200).send({ status: 200, data: admin })
                 })
                 .catch(err => {
                     res.status(422).send(err);
                 })
         })
         .catch(err => {
             res.status(422).send(err);
         })
 })




module.exports = adminRoute; 