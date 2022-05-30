'use strict';

// Импорт встроенных типов данных
const { DataTypes } = require('sequelize')

/*
  Этот мануал отсюда https://habr.com/ru/post/565062/
 */

// Строки
DataTypes.STRING // VARCHAR(255)
DataTypes.STRING(1234) // VARCHAR(1234)
DataTypes.STRING.BINARY // VARCHAR BINARY
DataTypes.TEXT // TEXT
DataTypes.TEXT('tiny') // TINYTEXT
DataTypes.CITEXT // CITEXT - только для `PostgreSQL` и `SQLite`

// Логические значения
DataTypes.BOOLEAN // BOOLEAN

// Числа
DataTypes.INTEGER // INTEGER
DataTypes.BIGINT // BIGINT
DataTypes.BIGINT(11) // BIGINT(11)

DataTypes.FLOAT // FLOAT
DataTypes.FLOAT(11) // FLOAT(11)
DataTypes.FLOAT(11, 10) // FLOAT(11, 10)

DataTypes.REAL // REAL - только для `PostgreSQL`
DataTypes.REAL(11) // REAL(11) - только для `PostgreSQL`
DataTypes.REAL(11, 12) // REAL(11,12) - только для `PostgreSQL`

DataTypes.DOUBLE // DOUBLE
DataTypes.DOUBLE(11) // DOUBLE(11)
DataTypes.DOUBLE(11, 10) // DOUBLE(11, 10)

DataTypes.DECIMAL // DECIMAL
DataTypes.DECIMAL(10, 2) // DECIMAL(10, 2)

// только для `MySQL`/`MariaDB`
DataTypes.INTEGER.UNSIGNED
DataTypes.INTEGER.ZEROFILL
DataTypes.INTEGER.UNSIGNED.ZEROFILL

// Даты
DataTypes.DATE // DATETIME для `mysql`/`sqlite`, TIMESTAMP с временной зоной для `postgres`
DataTypes.DATE(6) // DATETIME(6) для `mysql` 5.6.4+
DataTypes.DATEONLY // DATE без времени

// UUID
DataTypes.UUID

// Диапазоны (только для `postgres`)
DataTypes.RANGE(DataTypes.INTEGER) // int4range
DataTypes.RANGE(DataTypes.BIGINT) // int8range
DataTypes.RANGE(DataTypes.DATE) // tstzrange
DataTypes.RANGE(DataTypes.DATEONLY) // daterange
DataTypes.RANGE(DataTypes.DECIMAL) // numrange

// Буферы
DataTypes.BLOB // BLOB
DataTypes.BLOB('tiny') // TINYBLOB
DataTypes.BLOB('medium') // MEDIUMBLOB
DataTypes.BLOB('long') // LONGBLOB

// Перечисления - могут определяться по-другому (см. ниже)
DataTypes.ENUM('foo', 'bar')

// JSON (только для `sqlite`/`mysql`/`mariadb`/`postres`)
DataTypes.JSON

// JSONB (только для `postgres`)
DataTypes.JSONB

// другие
DataTypes.ARRAY(/* DataTypes.SOMETHING */) // массив DataTypes.SOMETHING. Только для `PostgreSQL`

DataTypes.CIDR // CIDR - только для `PostgreSQL`
DataTypes.INET // INET - только для `PostgreSQL`
DataTypes.MACADDR // MACADDR - только для `PostgreSQL`

DataTypes.GEOMETRY // Пространственная колонка. Только для `PostgreSQL` (с `PostGIS`) или `MySQL`
DataTypes.GEOMETRY('POINT') // Пространственная колонка с геометрическим типом. Только для `PostgreSQL` (с `PostGIS`) или `MySQL`
DataTypes.GEOMETRY('POINT', 4326) // Пространственная колонка с геометрическим типом и `SRID`. Только для `PostgreSQL` (с `PostGIS`) или `MySQL`