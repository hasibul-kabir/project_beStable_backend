/* Handeling Service Routers*/

//modules
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');

const authenticated = require('../middlewares/authorization');
const authorizedSeller = require('../middlewares/authorizedSeller');
const serviceSchema = require('../Schemas/ServiceSchema');


//module schaffolding
const router = express.Router();
//
const Service = mongoose.model('Service', serviceSchema);

router.route('/')
    .post([authenticated, authorizedSeller], async (req, res) => {
        const form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            const service = new Service(_.pick(fields, ['title', 'description', 'price', 'category', 'seller', 'deleverytime']));
            if (files.photo) {
                fs.readFile(files.photo.path, (err, data) => {
                    if (!err) {
                        service.photo.data = data;
                        service.photo.contentType = files.photo.type;
                    }
                    service.save((err, result) => {
                        if (!err) {
                            res.status(201).send({
                                message: 'Service added successfully!',
                                data: _.pick(result, ['title', 'description', 'price', 'category', 'seller', 'deleverytime'])
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

    })
    .get(async (req, res) => {
        try {
            const service = await Service.find().populate('category', 'name').populate('seller', 'name');
            return res.status(200).send(service);

        } catch (err) {
            res.status(400).send('Services not found');
        }
    });

router.route('/:id')
    .get(async (req, res) => {
        const serviceId = req.params.id;
        const service = await Service.findById(serviceId)
            .select({ photo: 0 })
            .populate('category', 'name')
            .populate('seller', 'name');
        if (!service) res.status(404).send('Service Not Found');
        return res.status(200).send(service);
    })
    .put([authenticated, authorizedSeller], async (req, res) => {
        const serviceId = req.params.id;
        const service = await Service.findById(serviceId);

        const form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, async (err, fields, files) => {
            if (err) return res.status(400).send('Something went wrong!');
            const updatedFields = _.pick(fields, ['title', 'description', 'price', 'deleverytime']);

            _.assignIn(service, updatedFields);

            if (files.photo) {
                fs.readFile(files.photo.path, async (err, data) => {
                    if (err) return res.status(400).send('Something went wrong');

                    service.photo.data = data;
                    service.photo.contentType = files.photo.type;

                    try {
                        await service.save();
                        res.status(200).send('Service updated successfully');

                    } catch (err) {
                        res.status(400).send('Update failed!');
                    }

                })
            } else {
                try {
                    await service.save();
                    res.status(200).send('Service updated successfully');

                } catch (err) {
                    res.status(400).send('Update failed!');
                }
            }
        })
    });

router.route('/photo/:id')
    .get(async (req, res) => {
        const serviceId = req.params.id;
        const service = await Service.findById(serviceId)
            .select({ photo: 1, _id: 0 })
        res.set('Content-Type', service.photo.contentType);
        return res.status(200).send(service.photo.data);
    });

//filter router
router.route('/filter')
    .post(async (req, res) => {
        const order = req.body.order === 'desc' ? -1 : 1;
        const sortBy = req.body.sortBy ? req.body.sortBy : '_id';
        const limit = req.body.limit ? parseInt(req.body.limit) : 5;
        const skip = parseInt(req.body.skip);
        const filters = req.body.filters;
        let args = {};

        for (let key in filters) {
            if (filters[key].length > 0) {
                if (key === 'price') {
                    args['price'] = {
                        $gte: filters['price'][0], $lte: filters['price'][1]
                    }
                }
                if (key === 'category') {
                    args['category'] = {
                        $in: filters['category']
                    }
                }
            }
        }
        const services = await Service.find(args)
            .select({ photo: 0 })
            .populate('category', 'name')
            .populate('seller', 'name')
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit)

        return res.status(200).send(services);
    })


module.exports = router;