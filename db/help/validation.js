'use strict';

// Валидация и ограничения

// Наша моделька будет выглядеть так:
// const { Sequelize, Op, DataTypes } = require('sequelize')
// const sequelize = new Sequelize('sqlite::memory:')

// const User = sequelize.define('user', {
//     username: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//     },
//     hashedPassword: {
//         type: DataTypes.STRING(64),
//         is: /^[0-9a-f]{64}$/i,
//     },
// })


// Отличие между выполнением валидации и применением или наложением органичение на значение поля состоит в следующем:
//
//
// валидация выполняется на уровне Sequelize; для ее выполнения можно использовать любую функцию, как встроенную, так и
// кастомную; при провале валидации, SQL-запрос в БД не отправляется;
// ограничение определяется на уровне SQL; примером ограничения является настройка unique; при провале ограничения,
// запрос в БД все равно отправляется
//
// В приведенном примере мы ограничили уникальность имени пользователя с помощью настройки unique. При попытке записать
// имя пользователя, которое уже существует в БД, возникнет ошибка SequelizeUniqueConstraintError.
//
//
// По умолчанию колонки таблицы могут быть пустыми (нулевыми). Настройка allowNull со значением false позволяет это
// запретить. Обратите внимание: без установки данной настройки хотя бы для одного поля, можно будет выполнить такой
// запрос: User.create({}).
//
//
// Валидаторы позволяют проводить проверку в отношении каждого атрибута модели. Валидация автоматически выполняется при
// запуске методов create(), update() и save(). Ее также можно запустить вручную с помощью validate().

// Как было отмечено ранее, мы можем определять собственные валидаторы или использовать встроенные
// (предоставляемые библиотекой validator.js).

// sequelize.define('foo', {
//   bar: {
//     type: DataTypes.STRING,
//     validate: {
//       is: /^[a-z]+$/i, // определение совпадения с регулярным выражением
//       not: /^[a-z]+$/i, // определение отсутствия совпадения с регуляркой
//       isEmail: true,
//       isUrl: true,
//       isIP: true,
//       isIPv4: true,
//       isIPv6: true,
//       isAlpha: true,
//       isAlphanumeric: true,
//       isNumeric: true,
//       isInt: true,
//       isFloat: true,
//       isDecimal: true,
//       isLowercase: true,
//       isUppercase: true,
//       notNull: true,
//       isNull: true,
//       notEmpty: true,
//       equals: 'определенное значение',
//       contains: 'foo', // определение наличия подстроки
//       notContains: 'bar', // определение отсутствия подстроки
//       notIn: [['foo', 'bar']], // определение того, что значение НЕ является одним из указанных
//       isIn: [['foo', 'bar']], // определение того, что значение является одним из указанных
//       len: [2, 10], // длина строки должна составлять от 2 до 10 символов
//       isUUID: true,
//       isDate: true,
//       isAfter: '2021-06-12',
//       isBefore: '2021-06-15',
//       max: 65,
//       min: 18,
//       isCreditCard: true,
//
//       // Примеры кастомных валидаторов
//       isEven(value) {
//         if (parseInt(value) % 2 !== 0) {
//           throw new Error('Разрешены только четные числа!')
//         }
//       },
//       isGreaterThanOtherField(value) {
//         if (parseInt(value) < parseInt(this.otherField)) {
//           throw new Error(
//             `Значение данного поля должно быть больше значения ${otherField}!`
//           )
//         }
//       },
//     },
//   },
// })

// Для кастомизации сообщения об ошибке можно использовать объект со свойством msg:
// isInt: {
//     msg: 'Значение должно быть целым числом!'
// }
// В этом случае для указания аргументов используется свойство args:
// isIn: {
//   args: [['ru', 'en']],
//   msg: 'Язык должен быть русским или английским!'
// }

// Для поля, которое может иметь значение null, встроенные валидаторы пропускаются. Это означает, что мы, например,
// можем определить поле, которое либо должно содержать строку длиной 5-10 символов, либо должно быть пустым:
// const User = sequelize.define('user', {
//   username: {
//     type: DataTypes.STRING,
//     allowNull: true,
//     validate: {
//       len: [5, 10],
//     },
//   },
// })

// Обратите внимание, что для нулевых полей кастомные валидаторы выполняются:
// const User = sequelize.define('user', {
//   age: DataTypes.INTEGER,
//   name: {
//     type: DataTypes.STRING,
//     allowNull: true,
//     validate: {
//       customValidator(value) {
//         if (value === null && this.age < 18) {
//           throw new Error('Нулевые значения разрешены только совершеннолетним!')
//         }
//       },
//     },
//   },
// })

// Мы можем выполнять валидацию не только отдельных полей, но и модели в целом. В следующем примере мы проверяем наличие
// или отсутствии как поля latitude, так и поля longitude (либо должны быть указаны оба поля, либо не должно быть
// указано ни одного):
// const Place = sequelize.define(
//   'place',
//   {
//     name: DataTypes.STRING,
//     address: DataTypes.STRING,
//     latitude: {
//       type: DataTypes.INTEGER,
//       validate: {
//         min: -90,
//         max: 90,
//       },
//     },
//     longitude: {
//       type: DataTypes.INTEGER,
//       validate: {
//         min: -180,
//         max: 180,
//       },
//     },
//   },
//   {
//     validate: {
//       bothCoordsOrNone() {
//         if (!this.latitude !== !this.longitude) {
//           throw new Error(
//             'Либо укажите и долготу, и широту, либо ничего не указывайте!'
//           )
//         }
//       },
//     },
//   }
// )