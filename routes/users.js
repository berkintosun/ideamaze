const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Loading Model
require('../models/User');
const User = mongoose.model('users');

// Login route
router.get('/login',(req,res) => {
    res.render('users/login');
})

router.post('/login',(req,res,next) => {
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash:true,
    })(req,res,next);
})

// Register
router.get('/register',(req,res) => {
    res.render('users/register');
})

router.post('/register',(req,res)=>{
    let errors = [];
    if(req.body.password != req.body.password2){
        req.flash()
        errors.push({text:'Passwords do not match'});
    }
    if(req.body.password.length < 4){
        errors.push({text:'Password must be longer than 4 characters'});
    }

    if(errors.length>0){
        res.render('users/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.email
        });
    }
    else{
        User.findOne({email:req.body.email})
        .then(user => {
            if(user){
                req.flash('error_msg','This email already registered');
                res.redirect('/users/register');
            }
            else{
                bcrypt.genSalt(10, (err,salt) => {
                    bcrypt.hash(req.body.password,salt, (err,hash) => {
                        if(err) throw err;
                        const newUser = new User ({
                            name: req.body.name,
                            email:req.body.email,
                            password:hash
                        });
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg','You are now registered succesfully');
                            res.redirect('/users/login');
                        })
                        .catch(err => {
                            console.log(err);
                            return;
                        })
                    })
                });
            }
        })
    }
})

module.exports = router;