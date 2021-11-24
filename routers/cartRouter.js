/**Handeling cart router */
//modules
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');

const cartSchema = require('../Schemas/cartSchema');
const authenticated = require('../middlewares/authorization');

//module Scaffolding
const router = express.Router();

//
const cartItem = mongoose.model('Cart', cartSchema);

//setting up Cart router

router.route('/')
    .post(authenticated, async (req, res) => {
        let { price, service } = _.pick(req.body, ["price", "service", "user"]);
        try {
            const item = await cartItem.findOne({
                user: req.body.user,
                service: req.body.service
                // service: req.service._id
            });
            if (!item) {
                let newCartItem = new cartItem({
                    price: price,
                    service: service,
                    // service: req.service,
                    user: req.body.user
                    // user: user
                });

                const result = await newCartItem.save();
                res.status(200).send({
                    message: "Item added to cart successfully!",
                    data: result
                });
            } else {
                res.status(400).send('This item is alraedy exists in cart!');
            }

        } catch (err) {
            res.status(500).send(err.message);

        }


    })
    .get(authenticated, async (req, res) => {
        const cartItems = await cartItem.find({
            user: req.user._id
        })
            .populate('service', 'name')
            .populate('user', 'name');

        return res.status(200).send(cartItems);


    })
// .put();

router.route('/:id')
    .delete(authenticated, async (req, res) => {
        const _id = req.params.id;
        const userId = req.user._id;

        await cartItem.deleteOne({ _id: _id, user: userId });
        return res.status(200).send("Item Removed!");
    });

module.exports = router;