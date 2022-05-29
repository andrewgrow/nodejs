'use strict';

// import Sequelize from 'sequelize'
const Sequelize = require('sequelize')

const database = process.env.DB_NAME
const username = process.env.DB_USER
const password = process.env.DB_PASSWORD

const db = new Sequelize(database, username, password, {
    dialect: 'mysql',
    logging: console.log,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    timezone: "+00:00"
})

async function testConnection() {
    db.authenticate().then((result) => { return result })
}


module.exports = { testConnection, db }