/* Handeling User Routers*/

//modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const userSchema = require('../Schemas/userSchema');


//module scaffolding
const router = express.Router();

const User = mongoose.model('User', userSchema);

//setup route
router.route('/signup')
    .post(async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPass = await bcrypt.hash(req.body.password, salt);//hashing password
                //console.log(req.body);
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    address: req.body.address,
                    password: hashedPass,
                    role: req.body.role
                })
                await newUser.save();
                res.status(200).send('নিবন্ধন সফল হয়েছে!')

            } else {
                res.status(400).send('ইতিমধ্যে এই নামে নিবন্ধন করা আছে!');
            }

        } catch (err) {
            res.status(500).send('নিবন্ধন ব্যার্থ হয়েছে!');

        }

    });

router.route('/signin')
    .post(async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });

            if (user) {
                const isValidPass = await bcrypt.compare(req.body.password, user.password);

                if (isValidPass) {

                    const token = jwt.sign({     //Generate token
                        userName: user.name,
                        userId: user._id,
                        email: user.email,
                        phone: user.phone,
                        address: user.address,
                        role: user.role,

                    },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: '1h' }
                    );

                    return res.status(200).json({
                        userData: _.pick(user, ['_id', 'name', 'email', 'phone', 'address', 'role']),
                        access_token: token,
                        message: "সাইনইন সফল হয়েছে!"
                    })
                } else {
                    res.status(401).json({
                        error: "ইমেইল বা পাসওয়ার্ড সঠিক নয়"
                    });
                }
            } else {
                res.status(401).json({
                    error: "ইমেইল বা পাসওয়ার্ড সঠিক নয়"
                });
            }

        } catch (err) {
            res.status(400).send(err);
        }
    });

router.get('/', async (req, res) => {
    const userId = req.query.userId;
    const userName = req.query.userName;

    try {
        const user = userId ? await User.findById(userId) : await User.findOne({ username: userName });
        res.status(200).send(user);

    } catch (err) {
        res.status(500).send(err);
    }
})
module.exports = router;