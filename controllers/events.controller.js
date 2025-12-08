const { Pool } = require('pg');
const db = new Pool({
    user: 'corentin',
    password: 'coco11037',
    database: 'ica',
    port: 5432,
});

exports.getAllEvents = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM events');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
};