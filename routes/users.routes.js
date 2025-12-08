const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/tokenAuth');
const usersController = require('../controllers/users.controller');

router.get('/', verifyToken, usersController.getAllUsers);

module.exports = router;