/*--Messages schema/model--- */
//modules
const mongoose = require('mongoose');

//Schema
const MessageSchema = mongoose.Schema({
    conversationId: {
        type: String,
    },
    sender: {
        type: String,
    },
    text: {
        type: String,
    }
}, { timestamps: true });

module.exports = MessageSchema;