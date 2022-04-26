const { STRING } = require('sequelize');
const Sequelize = require('sequelize');
const connection = require('../middleware/connection');

const CallType = connection.define('callType', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING
});

module.exports = CallType;