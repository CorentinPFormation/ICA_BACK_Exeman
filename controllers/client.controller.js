const knex = require('../config/knex');

exports.getAllClients = async (req, res) => {
    try {
        const client = await knex('client').select();
        res.send(client);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
};