const { Pool } = require('pg');
const db = new Pool({
    user: 'corentin',
    password: 'coco11037',
    database: 'ica',
    port: 5432,
});

exports.getAllUsers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
};