const Joi = require('joi');
const newsLetterService = require('../services/newsLetter');
const methods = {};

methods.newsLetter = async (req, res, next) => {
    try{
        newsLetterService(req, res, next)
    }
    catch(e){
        console.log("eeeeeeeeeeee ",e)
        return "error0"
    }
    //newsLetterService(req, res, next).catch(res.send("error0"))
    //res.JSON.send(req);
};


module.exports = methods;