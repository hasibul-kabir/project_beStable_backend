/*--handeling user profile router--*/
//modules
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
//
const authenticated = require('../middlewares/authorization');
const profileSchema = require('../Schemas/profileSchema');

//module schaffolding
const router = express.Router();
//
const Profile = mongoose.model('Profile', profileSchema);


router.route('/')
    .get(authenticated, async (req, res) => {
        const userId = req.user._id;
        const profile = await Profile.findOne({ user: userId });
        return res.status(200).send(profile);
    })
    .post(authenticated, async (req, res) => {
        const userId = req.user._id;
        const userProfile = _.pick(req.body, ['phone', 'address', 'city', 'postcode', 'country']);
        userProfile['user'] = userId;

        let profile = await Profile.findOne({ user: userId });
        if (profile) {
            await Profile.updateOne({ user: userId }, userProfile);
        } else {
            const profile = new Profile(userProfile);
            await profile.save();
        }
        return res.status(200).send(" Updated Successfully!");
    })


module.exports = router;