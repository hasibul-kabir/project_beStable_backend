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

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPass,
                    role: req.body.role
                })
                await newUser.save();
                res.status(200).send('Registration Successful!')

            } else {
                res.status(400).send('User alraedy exist');
            }

        } catch (err) {
            res.status(500).send('registrattion failed');

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
                        role: user.role,

                    },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: '1h' }
                    );

                    return res.status(200).json({
                        userData: _.pick(user, ['_id', 'name', 'email', 'role']),
                        access_token: token,
                        message: "Signin Successful!"
                    })
                } else {
                    res.status(401).json({
                        error: "password is not valid"
                    });
                }
            } else {
                res.status(401).json({
                    error: "Authentication failed"
                });
            }

        } catch (err) {
            res.status(400).send(err);
        }
    });


module.exports = router;