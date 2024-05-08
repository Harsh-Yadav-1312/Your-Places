const axios = require('axios');
const HttpError = require('../models/http-error');
const MAP_API_KEY = `AIzaSyCaE2wYXy6NRcZUVHWlBKoECgze406Zhwk`;

const getCoordsForAddress = async (address) => {

    // return {
    //     lat: 21.8380234 , lng: 73.716497
    // };


    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${MAP_API_KEY}`);

    const data = response.data;
    if(! data || data.status === "ZERO_RESULTS"){
        const error = new HttpError('The address could not be found', 404);
        throw error;
    }

    const coordinates = data.results[0].geometry.location;
    console.log(coordinates);

    return coordinates;

}

module.exports = getCoordsForAddress;