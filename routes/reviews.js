const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const {validateReview, isLoggedIn, isReviewAuthor, } = require('../middleware');

//add a new review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createNewReview));

//deletes a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;