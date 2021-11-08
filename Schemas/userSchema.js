/* --User Scemas/Models handeling-- */
//mudules
const mongoose = require('mongoose');

//user model/schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    role: {
        type: String,
        enum: ['Buyer', 'Seller'],
        default: 'Buyer'
    }
}, { timestamps: true });


module.exports = userSchema;


