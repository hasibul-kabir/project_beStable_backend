/*--Buyer Cart schema/model--- */
//modules
const mongoose = require('mongoose');

//Schema
const cartSchema = mongoose.Schema({
    service: {
        type: mongoose.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    price: Number,
    count: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = cartSchema;