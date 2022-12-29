/**Handeling category router */
//module
const express = require('express');
const mongoose = require('mongoose');

const authenticated = require('../middlewares/authorization');
const complaintsSchema = require('../Schemas/complaintsSchema');

//module scaffolding
const router = express.Router();
//
const Complaints = mongoose.model('Complaints', complaintsSchema);

//setup category router

router.route('/')
    .post([authenticated], async (req, res) => {

        const newComplaints = new Complaints({
            accused: req.body.accused,
            complain: req.body.complain
        })
        try {
            await newComplaints.save();
            res.status(200).json({
                message: 'Complaints added successfully!'
            })

        } catch (err) {
            res.status(500).send('Failed to add complaints!');
        }
    })

module.exports = router;