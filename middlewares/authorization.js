/*
 Authorization middleware
 */
//modules
const jwt = require('jsonwebtoken');

const authenticated = (req, res, next) => {
    const { authorization } = req.headers;

    try {
        const token = authorization.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; //getting user information from token
        next();

    } catch (error) {
        next('Authentication failed! :(');
    }
}

module.exports = authenticated;