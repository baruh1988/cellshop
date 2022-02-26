const Sequelize = require('sequelize');

const connection = new Sequelize(
    'cellshop',
    'root',
    'Azx12345',
    {
        dialect: 'mysql',
        hosr: 'localhost'
    }
);

module.exports = connection;