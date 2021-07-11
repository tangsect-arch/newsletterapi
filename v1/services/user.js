const config = require('../config/config.json');
const { Op } = require('sequelize');
const db = require('../db');
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');

module.exports = createSchema;

async function createSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required()
    });
    await validateRequest(req, next, schema);
    try{
        await create(req.body);
        res.send("success")
    }
    catch(e){
        res.send("error")
    }

}

async function create(params) {
    console.log("ljhgfdsdfghjk ",params)
    // validate
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const user = new db.User(params);
    await user.save();

    return await "success"
}
