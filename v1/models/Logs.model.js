const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [6, 128],
                    msg: "Email address must be between 6 and 128 characters in length"
                },
                isEmail: {
                    msg: "Invalid email address"
                }
            }
        },
        newsletterName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    };
    const options = {
        // If don't want updatedAt
        updatedAt: false
    };

    return sequelize.define('Logs', attributes, options);
}