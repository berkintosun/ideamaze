const localStrategy = require("passport-local").Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load User Model
require('../models/User');
const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new localStrategy({usernameField:'email'},(email,password,done) => {
        User.findOne({
            email:email
        }).then(user => {
            if(!user){
                return done(null,false,{message:'User cannot be found'});
            }

            // Password Matching
            bcrypt.compare(password,user.password,(err,success) => {
                if(err) throw err;
                if(success) return done(null,user);
                return done(null,false,{message:'Check your incridials'});
            })
        })
    }));

    passport.serializeUser((user,done) => {
        done(null,user.id);
    });

    passport.deserializeUser((id,done) => {
        User.findById(id,(err,user) => {
            done(err,user);
        })
    })
}