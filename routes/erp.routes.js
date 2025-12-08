const express = require('express');
const router = express.Router();
const erpController = require('../controllers/erp.controller');

router.get('/', erpController.getAllErp);

module.exports = router;