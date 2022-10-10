\! echo "=========================================================";
-- \p - this symbol is meaning that the command will printed into logs
CREATE DATABASE IF NOT EXISTS divo \p;
CREATE DATABASE IF NOT EXISTS divotest \p;

CREATE USER 'dbuser'@'%' IDENTIFIED BY 'dbpassword' \p;
CREATE USER 'dbusertest'@'%' IDENTIFIED BY 'dbpasswordtest' \p;

-- set permissions
-- USE divo \p;
GRANT ALL PRIVILEGES ON divo.* TO 'dbuser'@'%' \p;
-- FLUSH PRIVILEGES \p;
-- USE divotest \p;
GRANT ALL PRIVILEGES ON divotest.* TO 'dbusertest'@'%' \p;
FLUSH PRIVILEGES \p;