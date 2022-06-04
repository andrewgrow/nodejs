'use strict';

const sqlList = [
    "CREATE TABLE IF NOT EXISTS `users` " +
    "(`_id` INT AUTO_INCREMENT PRIMARY KEY, `phone` TEXT, `name` TEXT, `utc_created_at` " +
    "TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `utc_updated_at` TIMESTAMP, `utc_deleted_at` TIMESTAMP) " +
    "ENGINE = InnoDB;",

    "CREATE TABLE IF NOT EXISTS `telegram_users` (" +
    "    `_id` INT AUTO_INCREMENT PRIMARY KEY, " +
    "    `chat_id` TEXT," +
    "    `first_name` TEXT," +
    "    `last_name` TEXT," +
    "    `username` TEXT," +
    "    utc_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
    "    utc_updated_at TIMESTAMP," +
    "    utc_deleted_at TIMESTAMP" +
    ") ENGINE = InnoDB;"
];

module.exports = sqlList;