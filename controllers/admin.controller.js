const knex = require('../config/knex');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

exports.customInteropTeam = async (req, res) => {
    try {
        const token = req.headers.cookie.split(';').find(row => row.startsWith('ica_tk'))?.split('=')[1];
        const decodedToken = jwt.verify(token, secretKey);
        const userEmail = decodedToken.email;

        const user = await knex('users').where('email', userEmail).first();
        if (user.roles !== 'admin') {
            return res.status(403).json('Vous n\'avez pas accès à cette page');
        }

        res.json(user);
    } catch (error) {
        console.error('Vous n\'avez pas accès a cette page', error);
        res.status(500).json({ message: 'Un problème serveur est survenue' });
    }
};