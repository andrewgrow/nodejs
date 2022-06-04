'use strict';

const sqlList = [
    "CREATE TABLE IF NOT EXISTS `request_tokens` " +
    "(`_id` INT AUTO_INCREMENT PRIMARY KEY, `user_id` INT, `token` TEXT, " +
    "`utc_expire_at` TIMESTAMP, `utc_created_at` " +
    "TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `utc_updated_at` TIMESTAMP, `utc_deleted_at` TIMESTAMP) " +
    "ENGINE = InnoDB;",
];

module.exports = sqlList;