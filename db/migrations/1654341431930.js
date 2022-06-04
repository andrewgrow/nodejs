'use strict';

const sql = "CREATE TABLE IF NOT EXISTS `users` " +
    "(`_id` INT AUTO_INCREMENT PRIMARY KEY, `phone` TEXT, `name` TEXT, `utc_created_at` " +
    "TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `utc_updated_at` TIMESTAMP, `utc_deleted_at` TIMESTAMP) " +
    "ENGINE = InnoDB;";
module.exports = sql;