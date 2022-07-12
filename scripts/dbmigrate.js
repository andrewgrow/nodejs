'use strict';

const mysql = require('../db/db_mysql');
const fs = require('fs');
const path = require('path');
const migrationsPath = path.normalize(__dirname + "/../db/migrations/");

async function runMigration() {
    console.log(`Start dbMigrate! Current timestamp: ${ new Date().getTime() }`);
    const createMigrationsSQL = "CREATE TABLE IF NOT EXISTS `migrations` (`_id` INT AUTO_INCREMENT PRIMARY KEY, `filename` TEXT, `created_at` INT DEFAULT (UNIX_TIMESTAMP())) ENGINE = InnoDB;";
    await mysql
        .query(createMigrationsSQL, null)
        .then(getListWithNewMigrations)
        .then(newMigration)
        .then(() => { console.log("Migrations was successful!"); })
        .catch((err) => { console.error(err); });
}

/**
 * Take each file from the migration folder and compare with the migration table records.
 * If file does not include to the table it will be run as new migration.
 */
async function getListWithNewMigrations() {
    const fsList = await fs.promises.readdir(migrationsPath, { withFileTypes: true });
    fsList.sort(); // get a sorted files list in the Migration folder
    const filesList = fsList.map((item) => { return item.name })
    const querySQL = "SELECT * FROM `migrations` LIMIT 1000;"
    const dbMigrations =
        await mysql.query(querySQL, null)
            .then((result) => { return result; })
            .catch((err) => { console.error(err) })
    dbMigrations.sort(); // get a sorted files list with done migrations
    const doneMigrations = dbMigrations.map((item) => {
        return item.filename;
    });
    // each file that was migrated will be filtered
    // at the end we will get a list with migrations that was not run yet
    return filesList.filter((file) => {
        if (doneMigrations && doneMigrations.length > 0) {
            return !doneMigrations.includes(file);
        }
        return true;
    })
}

/**
 * Run new migrations from each file.
 */
async function newMigration(filesList) {
    let position, filepath, sql, sqlList;
    // take each file with new migration and run sql query
    for (position = 0; position < filesList.length; position++) {
        filepath = filesList[position];
        sqlList = require(`${ path.normalize(migrationsPath + filepath) }`); // take object from file
        for (sql of sqlList) {
            console.log(`migration SQL from file ${filepath}: ${ sql }`);
            await mysql.query(sql, null);
        }
        sql = "INSERT INTO `migrations` (filename) value (?);";
        await mysql.query(sql, [ filepath ]); // store that migration was done!
    }
}

for (let i=0; i < process.argv.length; i++) {
    console.log(`dbmigrate!!! process.argv ${ JSON.stringify(process.argv[i]) }`);
    switch (process.argv[i]) {
        case 'runMigration': runMigration().then(mysql.end); break;
    }
}

module.exports = { runMigration }