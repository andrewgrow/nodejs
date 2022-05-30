'use strict';

// Сортировка и группировка

// Настройка order определяет порядок сортировки возвращаемых объектов:
Submodel.findAll({
    order: [
        // Сортировка по заголовку (по убыванию)
        ['title', 'DESC'],

        // Сортировка по максимальному возврасту
        sequelize.fn('max', sequelize.col('age')),

        // Тоже самое, но по убыванию
        [sequelize.fn('max', sequelize.col('age')), 'DESC'],

        // Сортировка по `createdAt` из связанной модели
        [Model, 'createdAt', 'DESC'],

        // Сортировка по `createdAt` из двух связанных моделей
        [Model, AnotherModel, 'createdAt', 'DESC'],

        // и т.д.
    ]
})

Submodel.findAll({
    // Сортировка по максимальному возврасту (по убыванию)
    order: sequelize.literal('max(age) DESC'),
})

Submodel.findAll({
    // Сортировка по максимальному возрасту (по возрастанию - направление сортировки по умолчанию)
    order: sequelize.fn('max', sequelize.col('age')),
})

Submodel.findAll({
    // Сортировка по возрасту (по возрастанию)
    order: sequelize.col('age')
})

Submodel.findAll({
    // Случайная сортировка
    order: sequelize.random(),
})

Model.findOne({
    order: [
        // возвращает `name`
        ['name'],
        // возвращает `'name' DESC`
        ['name', 'DESC'],
        // возвращает `max('age')`
        sequelize.fn('max', sequelize.col('age')),
        // возвращает `max('age') DESC`
        [sequelize.fn('max', sequelize.col('age')), 'DESC'],

        // и т.д.
    ],
})

// Синтаксис группировки идентичен синтаксису сортировки, за исключением того, что при группировке не указывается
// направление. Кроме того, синтаксис группировки может быть сокращен до строки:
Project.findAll({ group: 'name' }) // GROUP BY name

// Настройки limit и offset позволяют ограничивать и/или пропускать определенное количество возвращаемых объектов:
// Получаем 10 проектов
Project.findAll({ limit: 10 })

// Пропускаем 5 первых объектов
Project.findAll({ offset: 5 })

// Пропускаем 5 первых объектов и возвращаем 10
Project.findAll({ offset: 5, limit: 10 })