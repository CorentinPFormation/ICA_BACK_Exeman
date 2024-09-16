const express = require('express')
const { Pool } = require('pg')
const app = express()
const port = 3000
const cors = require('cors')

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

const db = new Pool({
    user: 'corentin',
    password: 'coco11037',
    database: 'ica',
    port: 5433,
})

// routing
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/hook', (req, res) => {
    res.send('içi, les id et hook seront stocké')
})

app.get('/rules', (req, res) => {
    res.send('içi, les id et rules seront stocké')
})

app.get('/adapter', (req, res) => {
    res.send('içi, les id et adapter seront stocké')
})

app.get('/events', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM events')
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur')
    }
})

app.get('/document-type', (req, res) => {
    res.send('içi, les id et les types de document seront stocké')
})

app.get('/erp', (req, res) => {
    res.send('içi, les id et les erp seront stocké')
})

app.get('/client', (req, res) => {
    res.send('içi, les id et les clients seront stocké')
})

app.get('/users', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users')
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur')
    }
})

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = '005YVICAPC11037L';

app.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body;

        const result = await db.query('SELECT id_users , email, password FROM users WHERE email = $1', [email]);
        const user = result.rows[0];


        if (result.rows.length === 0) {
            return res.status(400).send('Email ou mot de passe incorrect');
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        console.log('validPassword is: ' + validPassword);
        if (!validPassword) {
            return res.status(400).send('Email ou mot de passe incorrect');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '336h' });

        res.cookie('ICA Json Web Token', token, {
                httpOnly: false,
                maxAge: 1209600000, // expire dans 14 jours
                domain: 'localhost',
                path: '/',
                secure: true
            });

        res.json({message: 'Connexion réussie'});
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
})

app.listen(port, () => {
    console.log(`ICA API listening on port ${port}`)
})
