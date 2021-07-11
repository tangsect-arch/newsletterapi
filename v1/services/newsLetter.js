const config = require('../config/config.json');
const { Op } = require('sequelize');
const db = require('../db');
const Joi = require('joi');
const csv = require('csv-parser');
const fs = require('fs');
const aws = require("aws-sdk");
const nodemailer = require('nodemailer');
//const { response } = require('express');
const ses = new aws.SES();
const s3 = new aws.S3();
var myCredentials = new aws.CognitoIdentityCredentials({IdentityPoolId:'us-west-2a:"Identity Pool ID"'});
var myConfig = new aws.Config({
          credentials: myCredentials, region: 'us-west-2a'
});

module.exports = readStreme;

async function readStreme(req, res, next) {
    let result =[];
    // const csv = req.files.csv_file
    // const csvName = new Date().getTime().toString()+reqFile.files.image1.name
    // csv.mv(`${csvName}`, function (err) {});
    let csvName = 'testcsv.csv'
    fs.createReadStream(csvName)
        .pipe(csv({
            delimiter:";"
        }))
        .on('data',(data) => {
            let userData = getUser(data);
        })
        .on('end',() => {
            res.send("success")
        });
        //return "success"
}

async function getUser(data) {
    const user =await db.User.findOne({ where: { email: data.Email } })
    if (!user) {
        return 'No user found.'
    }
    else{
        let sendMail = sendMailUser(user.dataValues,data);
    }
    return await user;
}

async function sendMailUser(user,data){
    let message = data.Content.replace('{firstName}',user.firstName)
        message = message.replace('{lastName}',user.lastName)
    let mailOptions = {
        from: 'noreply@mail.com',
        subject: data.Name,
        html: message,
        to:user.email
    };
    var transporter = nodemailer.createTransport({
        SES: ses
    });

    // send email
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            let newsLog = {
                email:user.email,
                newsletterName:data.Name
            }
            createSchema(newsLog)
        } else {
            let newsLog = {
                email:user.email,
                newsletterName:data.Name
            }
            createSchema(newsLog)
        }
    });
}



async function createSchema(newsLog) {
    const schema = Joi.object({
        newsletterName: Joi.string().required(),
        email: Joi.string().email().required()
    });
    await validateRequest(newsLog, schema);
    try{
        await create(newsLog);
        return "success"
    }
    catch(e){
        return "error"
    }

}

async function create(params) {
    const user = new db.Log(params);
    await user.save();

    return await "success"
}

function validateRequest(newsLog, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = schema.validate(newsLog, options);
    return value;
}
