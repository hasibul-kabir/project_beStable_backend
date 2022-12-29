/**Handeling conversations router */
//modules
const express = require('express');
const mongoose = require('mongoose');

const ConversationSchema = require("../Schemas/chat/ConversationSchema");

//module Scaffolding
const router = express.Router();
//
const Conversation = mongoose.model('Conversation', ConversationSchema);

router.route('/')
    .post(async (req, res) => {
        const newConversation = new Conversation({
            persons: [req.body.senderId, req.body.receiverId],
        });
        try {
            const result = await newConversation.save();
            res.status(200).send(result);

        } catch (err) {
            res.status(500).send(err);
        }
    });

router.get('/:userId', async (req, res) => {
    try {
        const result = await Conversation.find({
            persons: { $in: [req.params.userId] }
        });
        res.status(200).send(result);

    } catch (err) {
        res.status(500).send(err);
    }
})



module.exports = router;