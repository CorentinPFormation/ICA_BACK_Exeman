const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = new Pool({
    user: 'corentin',
    password: 'coco11037',
    database: 'ica',
    port: 5432,
});

const secretKey = process.env.SECRET_KEY;

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await db.query('SELECT id_users , email, password FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) return res.status(400).send('Email ou mot de passe incorrect');

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) return res.status(400).send('Email ou mot de passe incorrect');

        const token = jwt.sign({ id: user.id_users, email: user.email }, secretKey, { expiresIn: '336h' });

        res.cookie('ica_tk', token, {
            httpOnly: false,
            maxAge: 1209600000,
            domain: 'localhost',
            path: '/',
            secure: true
        });

        res.cookie('ica_em', user.email, {
            httpOnly: false,
            maxAge: 1209600000,
            domain: 'localhost',
            path: '/',
            secure: true
        });

        res.json({ message: 'Connexion réussie' });

    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
};