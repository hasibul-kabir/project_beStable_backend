/* --User Profile Scemas/Models handeling-- */
//mudules
const mongoose = require('mongoose');

//user profile model/schema
const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        unique: true,
        ref: 'User',
        required: true
    },
    // photo: {
    //     data: Buffer,
    //     contentType: String
    // },
    phone: {
        type: String,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postcode: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    }


});

module.exports = profileSchema;
