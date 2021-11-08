/* --Service Category Scemas/Models-- */

//modules
const mongoose = require('mongoose');

//Service Category model/schema
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        uniq: true
    }
}, { timestamps: true });

module.exports = categorySchema;