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
    .post(authenticated, async (req, res) => {
        const form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            const profile = new Profile(_.pick(fields, ['user', 'phone', 'address']));
            if (files.photo) {
                fs.readFile(files.photo.path, (err, data) => {
                    if (!err) {
                        profile.photo.data = data;
                        profile.photo.contentType = files.photo.type;
                    }
                    profile.save((err, result) => {
                        if (!err) {
                            res.status(201).send({
                                data: _.pick(result, ['user', 'phone', 'address'])
                            })
                        } else {
                            res.status(400).send('Server error');
                        }
                    })
                })
            } else {
                res.status(400).send('No image provided!');
            }
        })
    });

router.route('/:id')
    .get(authenticated, async (req, res) => {
        const profileId = req.params.id;
        const profile = await Profile.findById(profileId)
            .select({ photo: 0 })
            .populate('user', 'name');
        if (!profile) res.status(404).send('Profile Not Found');
        return res.status(200).send(service);
    })
    .put(authenticated, async (req, res) => {
        const profileId = req.params.id;
        const profile = await Service.find({
            _id: profileId,
            userId: req.user._id
        });

        const form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, async (err, fields, files) => {
            if (err) return res.status(400).send('Something went wrong!');
            const updatedFields = _.pick(fields, ['phone', 'address']);

            _.assignIn(profile, updatedFields);

            if (files.photo) {
                fs.readFile(files.photo.path, async (err, data) => {
                    if (err) return res.status(400).send('Something went wrong');

                    profile.photo.data = data;
                    profile.photo.contentType = files.photo.type;

                    try {
                        await profile.save();
                        res.status(200).send('Profile updated successfully');

                    } catch (err) {
                        res.status(400).send('Update failed!');
                    }

                })
            } else {
                try {
                    await profile.save();
                    res.status(200).send('Profile updated successfully');

                } catch (err) {
                    res.status(400).send('Update failed!');
                }
            }
        })
    });

module.exports = router;