/**Handeling conversations router */
//modules
const { response } = require('express');
const express = require('express');
const mongoose = require('mongoose');

const MessageSchema = require("../Schemas/chat/MessageSchema");

//module Scaffolding
const router = express.Router();
//
const Message = mongoose.model('Message', MessageSchema);

router.post('/', async (req, res) => {
    const newMessage = new Message(req.body)
    try {
        const result = await newMessage.save();
        res.status(200).send(result);
    } catch (err) {
        response.status(500).send(err)
    }
});

router.get('/:conversationId', async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        })
        res.status(200).send(messages);
    } catch (err) {
        res.status(500).send(err);
    }
})



module.exports = router;