const { string } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review'); 
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };
const mongoosePaginate = require('mongoose-paginate-v2');


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String, 
            enum: ['Point'], // 'geometry.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    rating: Number
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong><br>${this.location}<br>$${this.price}/day`;
});


CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    };
});

CampgroundSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Campground', CampgroundSchema);
