const jwt = require('jsonwebtoken');
const secretKey  = '00YVICAPC11037L';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if(!token) {
        return res.status(403).send('Pas de token');
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