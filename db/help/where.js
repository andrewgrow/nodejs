'use strict';

// Настройка where позволяет выполнять фильтрацию возвращаемых данных.
// Существует большое количество операторов, которые могут использоваться совместно с where через Op (см. operators.js).

// Выполняем поиск поста по идентификатору его автора
// предполагается `Op.eq`
Post.findAll({
    where: {
        authorId: 2,
    },
}) // SELECT * FROM post WHERE authorId = 2;

// Полный вариант
const { Op } = require('sequelize')
Post.findAll({
    where: {
        authorId: {
            [Op.eq]: 2,
        },
    },
})

// Фильтрация по нескольким полям
// предполагается `Op.and`
Post.findAll({
    where: {
        authorId: 2,
        status: 'active',
    },
}) // SELECT * FROM post WHERE authorId = 2 AND status = 'active';

// Полный вариант
Post.findAll({
    where: {
        [Op.and]: [{ authorId: 2 }, { status: 'active' }],
    },
})

// ИЛИ
Post.findAll({
    where: {
        [Op.or]: [{ authorId: 2 }, { authorId: 3 }],
    },
}) // SELECT * FROM post WHERE authorId = 12 OR authorId = 13;

// Одинаковые названия полей можно опускать
Post.destroy({
    where: {
        authorId: {
            [Op.or]: [2, 3],
        },
    },
}) // DELETE FROM post WHERE authorId = 2 OR authorId = 3;