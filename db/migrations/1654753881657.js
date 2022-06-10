'use strict';

const sqlList = [
    "CREATE TABLE IF NOT EXISTS `account_transactions`" +
    "    (`_id` INT AUTO_INCREMENT PRIMARY KEY," +
    "    `contractor_id` INT," +
    "    `author_id` INT," +
    "    `sum` INT," +
    "    `currency` TINYTEXT," +
    "    `type` TINYTEXT," +
    "    `created_at` INT DEFAULT (UNIX_TIMESTAMP())," +
    "    `updated_at` INT," +
    "    `deleted_at` INT," +
    "    FOREIGN KEY (`contractor_id`) REFERENCES `users` (`_id`) ON DELETE SET NULL," +
    "    FOREIGN KEY (`author_id`) REFERENCES `users` (`_id`) ON DELETE SET NULL" +
    "    ) ENGINE = InnoDB;",
];

module.exports = sqlList;