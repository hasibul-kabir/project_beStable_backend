/* --Services Schema/Models-- */
//modules
const mongoose = require('mongoose');

//Schema
const serviceSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    seller: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    deleverytime: {
        type: Number,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true });

module.exports = serviceSchema;