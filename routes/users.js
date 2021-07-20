const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');


//get: render sign up form
//post: sign up new user
router.route('/register')
    .get(users.renderSignUpForm)
    .post(catchAsync(users.signUpNewUser));

//get: render login page
//post: login the user
router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser);

//logout the user
router.get('/logout', users.logoutUser);

module.exports = router;