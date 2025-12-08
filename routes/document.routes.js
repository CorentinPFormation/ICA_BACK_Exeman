const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');

router.get('/', documentController.getAllDocumentTypes);

module.exports = router;