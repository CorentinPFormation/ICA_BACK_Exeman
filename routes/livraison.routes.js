const express = require('express');
const router = express.Router();
const livraisonController = require('../controllers/livraison.controller');

router.get('/', livraisonController.getLivraison);
router.post('/update-livraison', livraisonController.updateLivraison);

module.exports = router;