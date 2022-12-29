/* --Complaints Scemas/Models-- */

//modules
const mongoose = require('mongoose');

//Complaints model/schema
const complaintsSchema = mongoose.Schema({
    accused: {
        type: String,
        required: true,
    },
    complain: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = complaintsSchema;