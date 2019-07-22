const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Login route
router.get('/login',(req,res) => {
    res.render('users/login');
})

// Register
router.get('/register',(req,res) => {
    res.render('users/register');
})

module.exports = router;