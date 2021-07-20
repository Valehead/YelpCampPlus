// const { String, Number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    body: String,    
    campground: {
        type: Schema.Types.ObjectId,
        ref: 'Campground'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Review', reviewSchema);