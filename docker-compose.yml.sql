version: '3'
services:
  db:
    image: 'mysql:8.0.28'
    command: --default-authentication-plugin=mysql_native_password
    ports:
      - '33060:3306'
    environment:
      - MYSQL_ALLOW_EMPTY_PASSWORD=true
    volumes:
      - "./config/dbmysql-init.sql:/docker-entrypoint-initdb.d/dbmysql-init.sql"