/*
Title: Project 'BeStable'.
Description: Backend app of BeStable, a freelancing marketplace web app.
Author: Hasibul Kabir 
*/

// Modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

const userRouter = require('./routers/userRouter');
const categoryRouter = require('./routers/categoryRouter');
const serviceRouter = require('./routers/serviceRouter');
const cartRouter = require('./routers/cartRouter');
const profileRouter = require('./routers/profileRouter');
const conversationsRouter = require('./routers/conversationsRouter');
const messagesRouter = require('./routers/messagesRouter');
const complaintsRouter = require('./routers/complaintsRouter');

dotenv.config();
//module scaffolding 
const app = express();
//
app.use(express.json());
app.use(cors());

//database connection
mongoose.connect(process.env.MONGODB_LOCAL_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('connected to Mongodb'))
    .catch((err) => console.log('mongodb connection failed'));


//router middleware
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/service', serviceRouter);
app.use('/cart', cartRouter);
app.use('/profile', profileRouter);
app.use('/conversations', conversationsRouter);
app.use('/messages', messagesRouter);
app.use('/complaints', complaintsRouter);


//Error handling middleware
app.use((err, req, res, next) => {
    if (res.headerSent) {
        return next(err)
    }
    res.status(500).json({ error: err });
})


//connect to server
const port = process.env.PORT
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})

