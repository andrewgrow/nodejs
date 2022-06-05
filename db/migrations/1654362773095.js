'use strict';

const sqlList = [
    "CREATE TABLE IF NOT EXISTS `request_tokens`" +
    "    (`_id` INT AUTO_INCREMENT PRIMARY KEY," +
    "    `user_id` INT," +
    "    `value` TEXT," +
    "    `expire_at` INT," +
    "    `created_at` INT DEFAULT (UNIX_TIMESTAMP())," +
    "    `updated_at` INT," +
    "    `deleted_at` INT," +
    "    FOREIGN KEY (`user_id`) REFERENCES `users` (`_id`) ON DELETE CASCADE" +
    "    ) ENGINE = InnoDB;"
];

module.exports = sqlList;