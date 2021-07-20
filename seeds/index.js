const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors, images } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
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
            author: '6090b2d08159343300d8646d',
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
        await camp.save();
    };
};

seedDB().then(() => {
    mongoose.connection.close();
});