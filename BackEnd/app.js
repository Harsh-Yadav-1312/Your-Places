const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

const password = encodeURIComponent("svxkJyuxyKDQ67V9");
// const url = `mongodb+srv://akramzishan007:${password}@cluster0.07h2bn4.mongodb.net/userplaces?retryWrites=true&w=majority`;
const url = `mongodb+srv://harshdv1312:YourPlaces0804@cluster0.bkhdcqb.mongodb.net/userplaces?retryWrites=true&w=majority`;

app.use(bodyParser.json());

// const p =path.join('uploads', 'images');
// const rep = p.replaceAll("\\", "/");
// console.log(rep);
// app.use('/uploads/images', express.static(rep));
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// app.use(
//     cors({
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST', 'PATCH', 'DELETE']
//     })
// );

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    next();
});

app.use('/api/places', placesRoutes); // => /api/places...
app.use('/api/users', usersRoutes); // => /api/places...

// For any Unsupported Routes, execute this middleware
app.use((req, res, next) => {
    const error = new HttpError('Could Not find this Route', 404);
    throw error;
});

//For error thrown in response, execute this middleware
app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An Unknown Error Occurred' });
});


mongoose
    .connect(url)
    .then(() => {
        app.listen(process.env.PORT || 5000);
    })
    .catch(err => {
        console.log(err);
    });

