const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/tokenAuth');
const hookController = require('../controllers/hook.controller');

router.post('/form_hook', verifyToken, hookController.createFormHook);
router.get('/list-hook-by-user', verifyToken, hookController.listHookByUser);
router.get('/:id', hookController.getHookById);

module.exports = router;