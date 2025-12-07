const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const secretKey = process.env.SECRET_KEY

const verifyToken = (req, res, next) => {
    const token = req.cookies['ica_tk'];

    if(!token) {
        return res.status(404).send('Pas de token');
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send('token invalide');
    }
};

module.exports = verifyToken;