const hookService = require('../services/hook.service');

exports.createFormHook = async (req, res) => {
    await hookService.createFormHook(req, res);
};

exports.listHookByUser = async (req, res) => {
    await hookService.listHookByUser(req, res);
};

exports.getHookById = async (req, res) => {
    await hookService.getHookById(req, res);
};