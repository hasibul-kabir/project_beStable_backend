/*--Conversations schema/model--- */
//modules
const mongoose = require('mongoose');

//Schema
const ConversationSchema = mongoose.Schema({
    persons: {
        type: Array,
    }
}, { timestamps: true });

module.exports = ConversationSchema;