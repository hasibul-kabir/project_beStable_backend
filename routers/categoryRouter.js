/**Handeling category router */
//module
const express = require('express');
const mongoose = require('mongoose');

const authenticated = require('../middlewares/authorization');
const authorizedSeller = require('../middlewares/authorizedSeller');
const categorySchema = require('../Schemas/categorySchema');

//module scaffolding
const router = express.Router();
//
const Category = mongoose.model('Category', categorySchema);

//setup category router

router.route('/')
    .post([authenticated, authorizedSeller], async (req, res) => {

        const newCategory = new Category({
            name: req.body.name
        })
        try {
            await newCategory.save();
            res.status(200).json({
                message: 'Category added successfully!'
            })

        } catch (err) {
            res.status(500).send('Failed to add category!');
        }
    })
    .get(async (req, res) => {
        const categories = await Category.find().select({ _id: 1, name: 1 }).sort({ name: 1 });
        return res.status(200).send(categories);
    })
module.exports = router;