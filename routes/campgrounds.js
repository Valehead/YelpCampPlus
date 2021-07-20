const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const {isLoggedIn, validateCampground, isAuthor, returnAfterLogin} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });
 

//get: gets campground index page
//post: creates new campground
router.route('/')
    .get(returnAfterLogin, catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('images'), validateCampground, catchAsync(campgrounds.createCampground));

//gets new campground page
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

//gets edit campground form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

//put: updates campground entry
//get: shows single campground page
//delete: deletes campground
router.route('/:id')
    .put(isLoggedIn, isAuthor, upload.array('images'), validateCampground, catchAsync(campgrounds.updateCampground))
    .get(returnAfterLogin, catchAsync(campgrounds.showCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;