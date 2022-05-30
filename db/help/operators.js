'use strict';

const { Op } = require('sequelize')

Post.findAll({
    where: {
        [Op.and]: [{ a: 1, b: 2 }],   // (a = 1) AND (b = 2)
        [Op.or]: [{ a: 1, b: 2 }],    // (a = 1) OR (b = 2)
        someAttr: {
            // Основные
            [Op.eq]: 3,       // = 3
            [Op.ne]: 4,       // != 4
            [Op.is]: null,    // IS NULL
            [Op.not]: true,   // IS NOT TRUE
            [Op.or]: [5, 6],  // (someAttr = 5) OR (someAttr = 6)

            // Использование диалекта определенной БД (`postgres`, в данном случае)
            [Op.col]: 'user.org_id',    // = 'user'.'org_id'

            // Сравнение чисел
            [Op.gt]: 6,               // > 6
            [Op.gte]: 6,              // >= 6
            [Op.lt]: 7,               // < 7
            [Op.lte]: 7,              // <= 7
            [Op.between]: [8, 10],    // BETWEEN 8 AND 10
            [Op.notBetween]: [8, 10], // NOT BETWEEN 8 AND 10

            // Другие
            [Op.all]: sequelize.literal('SELECT 1'), // > ALL (SELECT 1)

            [Op.in]: [10, 12],    // IN [1, 2]
            [Op.notIn]: [10, 12],  // NOT IN [1, 2]

            [Op.like]: '%foo',      // LIKE '%foo'
            [Op.notLike]: '%foo',   // NOT LIKE '%foo'
            [Op.startsWith]: 'foo', // LIKE 'foo%'
            [Op.endsWith]: 'foo',   // LIKE '%foo'
            [Op.substring]: 'foo',  // LIKE '%foo%'
            [Op.iLike]: '%foo',     // ILIKE '%foo' (учет регистра, только для `postgres`)
            [Op.notILike]: '%foo',        // NOT ILIKE '%foo'
            [Op.regexp]: '^[b|a|r]',      // REGEXP/~ '^[b|a|r]' (только для `mysql`/`postgres`)
            [Op.notRegexp]: '^[b|a|r]',   // NOT REGEXP/!~ '^[b|a|r]' (только для `mysql`/`postgres`),
            [Op.iRegexp]: '^[b|a|r]',     // ~* '^[b|a|r]' (только для `postgres`)
            [Op.notIRegexp]: '^[b|a|r]',  // !~* '^[b|a|r]' (только для `postgres`)

            [Op.any]: [2, 3], // ANY ARRAY[2, 3]::INTEGER (только для `postgres`)

            [Op.like]: { [Op.any]: ['foo', 'bar'] } // LIKE ANY ARRAY['foo', 'bar'] (только для `postgres`)

            // и т.д.
        }
    }
})