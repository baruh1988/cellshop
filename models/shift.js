const { STRING } = require('sequelize');
const Sequelize = require('sequelize');
const connection = require('../middleware/connection');

const Shift = connection.define('shift', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING
});

module.exports = Shift;