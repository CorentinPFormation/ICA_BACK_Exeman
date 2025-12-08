const knex = require('../config/knex');

exports.getLivraison = async (req, res) => {
    try {
        const result = await knex('livraison').select('temps_livraison');
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
};

exports.updateLivraison = async (req, res) => {
    try {
        const { updateLivraison } = req.body;
        await knex('livraison').where({id_livraison: '1'}).update({ temps_livraison: updateLivraison });
        res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la mise à jours du temps de livraison' });
    }
};