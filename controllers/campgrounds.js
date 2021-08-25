const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { response } = require('express');
const geoCoder = mbxGeoCoding({accessToken: mapBoxToken});


module.exports.index = async (req, res) => {
    if(!req.query.page){
        const mapgrounds = await Campground.find({});
        const campgrounds = await Campground.paginate({}, {
            limit: 15
        });
        res.render('campgrounds/index', { mapgrounds, campgrounds });    
    } else{
        let { page } = req.query;
        const campgrounds = await Campground.paginate({}, {
            page,
            limit: 15
        });
        res.send( campgrounds );    
    }    
};

module.exports.createCampground = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    })
    .send()

    const newCamp = new Campground(req.body.campground);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename}));
    newCamp.author = req.user._id;
    newCamp.rating = 0;
    await newCamp.save();
    //console.log(newCamp);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCamp._id}`);
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename);
        };
        await campground.updateOne({  $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    };
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({path: 'reviews', populate: {path: 'author'}}).populate('author');
    if (!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    };
    res.render('campgrounds/show', { campground });
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
};

module.exports.findCampground = async (req, res) => {
    const { search } = req.query;
    const campgrounds = await Campground.find({$text: { $search : `\"${search}\"`}});
    res.render('campgrounds/search', { campgrounds, search });
};