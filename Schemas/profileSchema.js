/* --User Profile Scemas/Models handeling-- */
//mudules
const mongoose = require('mongoose');

//user profile model/schema
const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    phone: {
        type: String,
        unique: true
    },
    address: {
        type: String,
        required: true
    }

});

module.exports = profileSchema;
