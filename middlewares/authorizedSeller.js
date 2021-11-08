/*
 middleware to check authorized seller
*/
const authorizedSeller = (req, res, next) => {
    if (req.user.role !== 'Seller')
        return res.status(403).send('Forbidden!');
    next();
}

module.exports = authorizedSeller;
