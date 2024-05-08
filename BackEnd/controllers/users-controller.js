const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const mongoose = require('mongoose');
const {validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const DUMMY_USERS = [
//     {id:'u1', name: 'Harish', email: 'u1@ekeeda.com', password: 'testing'},
//     {id:'u2', name: 'Manish', email: 'u2@ekeeda.com', password: 'testing'},
//     {id:'u3', name: 'Rakesh', email: 'u3@ekeeda.com', password: 'testing'},
//     {id:'u4', name: 'Ajay', email: 'u4@ekeeda.com', password: 'testing'}
// ];

const getUsers = async (req,res,next) => {
    let users;
    try{
        users = await User.find({}, {password:0}); //password should not be received--CHECK
    }
    catch(err){
        const error = new HttpError('Fetching Users failed', 500);
    }
    res.status(200).json({users: users.map(user => user.toObject({getters:true}))}); 

};

const signup = async (req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError('Invalid Inputs passsed, please check your data', 422));
    }
    const { name, email, password } = req.body;

    let existingUser;

    try{
        existingUser = await User.findOne({email:email});
    }
    catch(err){
        const error = new HttpError('Signing up failed, please try again later', 500);
        return next(error);
    }

    if(existingUser){
        const error = new HttpError('User already exists, please login instead', 422);
        return next(error);
    }
    
    let hashedPassword;

    try{
        hashedPassword = await bcrypt.hash(password, 12);     //second parameter is salting
    }
    catch(err){
        const error = new HttpError('Could not create user', 500);
        return next(error);
    }
    
    
    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        imageUrl: req.file.path,
        places: []
    });
    
    try{
        await createdUser.save();
    }
    catch(err){
        const error = new HttpError('Signing up failed, please try again', 500);
        return next(error);
    }
    let token;
    try{
    token = await jwt.sign({userId: createdUser.id, email: createdUser.email}, 'supersecret_dont_share', {expiresIn: '1h'});
    }
    catch(err){
        const error = new HttpError('Signing up failed, please try again', 500);
        return next(error);
    }
    res.status(201).json({userId: createdUser.id, email: createdUser.email, token}); //201 status: New addition
};

const login = async (req,res,next) => {

    const {email, password} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email:email});
    }
    catch(err){
        const error = new HttpError('Logging in failed, please try later', 500);
        return next(error);
    }

    if(!existingUser){
        const error = new HttpError('Could not identify user, credentials seem to be wrong', 401);
        return next(error);
    }
    let isValidPassword = false;
    try{
    isValidPassword = await bcrypt.compare(password, existingUser.password);
    }
    catch(err){
        const error = new HttpError('Password incorrect, please try again', 500);
        return next(error);
    }
    if(!isValidPassword){
        const error = new HttpError('Could not identify user, credentials seem to be wrong', 401);
        return next(error);
    }
    let token;
    try{
        token = await jwt.sign({userId: existingUser.id, email: existingUser.email}, 'supersecret_dont_share', {expiresIn: '1h'});      // 2nd parameter is private key
    }
    catch(err){
        const error = new HttpError('Could not identify user, credentials seem to be wrong', 401);
        return next(error);
    }
    res.json({message: 'LoggedIn!', userId: existingUser.id, email: existingUser.email, token});

};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;