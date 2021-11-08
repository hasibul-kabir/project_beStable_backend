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
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = cartSchema;