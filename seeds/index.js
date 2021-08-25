const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors, images, compliments, eyedeez } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'; //production
//const dbURL = 'mongodb://localhost:27017/yelp-camp'; //development


mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

function ranimg() {return (Math.floor(Math.random() * images.length))};
//production userID: 60e50ac38e87ea0015e673c4
//development userID: 6090b2d08159343300d8646d

const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const ran1 = ranimg();
        const ran2 = ranimg();
        const ran3 = ranimg();
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 50) + 10;
        const camp = new Campground({
            author: '60e50ac38e87ea0015e673c4',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci molestias enim culpa aut ipsa tenetur eligendi iure natus, et nam obcaecati commodi, earum quis modi nisi, aliquam sapiente sed facere.',
            price,
            geometry: {
                type: "Point",
                coordinates: [ `${cities[random1000].longitude}`, `${cities[random1000].latitude}` ]
            },
            "images" : [ { "url" : `${images[ran1].url}`, "filename" : `${images[ran1].filename}` },
            { "url" : `${images[ran2].url}`, "filename" : `${images[ran2].filename}` },
            { "url" : `${images[ran3].url}`, "filename" : `${images[ran3].filename}` } ]
        });
        const ranReviews = Math.floor(Math.random()*12) + 1;
        let totalRating = 0;
        for(let g = 0; g < ranReviews; g++){
            const rating = Math.floor(Math.random() * (5 - 2 + 1) + 2);
            const review = new Review({
                rating,
                body: compliments[Math.floor(Math.random()*compliments.length)],
                campground: camp._id,
                author: eyedeez[Math.floor(Math.random()*eyedeez.length)]
            });
            totalRating += rating;
            camp.reviews.push(review);
            await review.save();
        };
        camp.rating = totalRating/ranReviews;
        await camp.save();
    };
};

seedDB().then(() => {
    mongoose.connection.close();
});