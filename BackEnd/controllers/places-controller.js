const HttpError = require('../models/http-error');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, res,next) => {
    const placeId = req.params.pid;

    let place;
    try{
        place = await Place.findById(placeId);
    }
    catch(err){
        const error = new HttpError('Something went wrong, could not find a place', 500);
        return next(error);
    }
    
    if(!place){
    //    const error = new Error('Could not find any place with the given Place ID');
    //    error.code = 404;
    //    return next(error);

    return next(new HttpError('Could not find the place with given Place ID', 404));
    }

    res.json({place: place.toObject( { getters: true} )});
};


const getPlacesByUserId = async (req,res,next)=>{
    const userId = req.params.uid;
    // Place.find({creator: userId});
    
    // let places;
    let userWithPlaces;

    try{
        userWithPlaces = await User.findById(userId).populate('places');
        console.log(userWithPlaces);
    }
    catch(err){
        const error = new HttpError('Could not find place', 500);
        return next(error);
    }

    
    if(!userWithPlaces){
        return next(new HttpError('Could not find places with given User ID', 404));
    }
    
    res.json({places: userWithPlaces.places.map(place => place.toObject({getters:true}))});
};

const createPlace = async (req,res,next) => {

    const errors = validationResult(req);
    // console.log(errors);

    if(!errors.isEmpty()){
        console.log(errors);
        return next(HttpError('Invalid Inputs passsed, please check your data', 422));
    }

    const {title, description, address, creator} = req.body;

    let coordinates;

    try{
        coordinates = await getCoordsForAddress(address);
    }
    catch(error){
        return next(error);
    }

    //CRUD
    // Create
    // Update
    // Delete

    const createdPlace = new Place({
        title: title,
        description: description,
        address:address,
        location:coordinates,
        imageUrl: req.file.path,
        creator: creator
       });

    let user;

    try{
        user = await User.findById(creator);

    }
    catch(err){
        const error = new HttpError('Creating place failed', 500);
        return next(error);
    }

    if(!user){
        const error = new HttpError('Could not find User for provided ID', 404);
        return next(error);
    }
    console.log(user);

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        user.places.push(createdPlace);
        await user.save({session:sess});
        sess.commitTransaction();
    }
    catch(err){
        const error = new HttpError('Creating place failed, please try again', 500);
        return next(error);
    }

    res.status(201).json({place: createdPlace}); //201: when you insert a new value
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError('Invalid Inputs passsed, please check your data', 422));
    }

    const {title, description} = req.body;
    const placeId = req.params.pid;

    let place;

    try{
        place = await Place.findById(placeId);
        place.title= title;
        place.description = description;
    }
    catch(err){
        return next(new HttpError('Could not update place', 500));
    }
    if(place.creator.toString() !== req.userData.userId){
        const error = new HttpError('You are not allowed to edit this place', 403);
        return next(error);
    }
    try{
        await place.save();
    }
    catch(err){
        return next(new HttpError('Something went wrong, Could not update place', 500));
    }
    
    res.status(200).json({place: place.toObject({getters:true})});
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try{
        place = await Place.findById(placeId).populate('creator');
    }
    catch(err){
        const error = new HttpError('Could not find the place' +err, 500);
        return next(error);
    }
    console.log(place);
    
    if(!place){
        const error = new HttpError('Could not find the place for this ID', 500);
        return next(error);
    }
    if(place.creator.id.toString() !== req.userData.userId){
        const error = new HttpError('You are not allowed to delete this place', 403);
        return next(error);
    }
    const imagePath = place.imageUrl;
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({session: sess});
        place.creator.places.pull(place);
        await place.creator.save({session:sess});
        await sess.commitTransaction();
    }
    catch(err){
        const error = new HttpError('Could not find the place', 500);
        return next(error);
    }
    fs.unlink(imagePath, err =>{ console.log(err)});

    res.status(200).json({message: `Deleted place having ID: ${placeId}`});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;