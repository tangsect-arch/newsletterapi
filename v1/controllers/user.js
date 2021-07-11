const Joi = require('joi');
const userService = require('../services/user');
const methods = {};

methods.user = async (req, res, next) => {
    userService(req, res, next).catch(res.send(error))
    //res.send(req.body);
};


module.exports = methods;