'use strict';

// import Sequelize from 'sequelize'
const Sequelize = require('sequelize');

const config = require('./db_config');

const db = new Sequelize(config.name, config.user, config.password, {
    dialect: 'mysql',
    logging: console.log,
    host: config.host,
    port: config.password,
    timezone: "+00:00"
});

async function testConnection() {
    db.authenticate().then((result) => { return result });
}

module.exports = { testConnection, db };