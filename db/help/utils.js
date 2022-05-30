'use strict';

// Определяем число вхождений
console.log(
    `В настоящий момент в БД находится ${await Project.count()} проектов.`
)

const amount = await Project.count({
    where: {
        projectId: {
            [Op.gt]: 25,
        },
    },
})
console.log(
    `В настоящий момент в БД находится ${amount} проектов с идентификатором больше 25.`
)

// max, min, sum
// Предположим, что у нас имеется 3 пользователя 20, 30 и 40 лет
await User.max('age') // 40
await User.max('age', { where: { age: { [Op.lt]: 31 } } }) // 30
await User.min('age') // 20
await User.min('age', { where: { age: { [Op.gt]: 21 } } }) // 30
await User.sum('age') // 90
await User.sum('age', { where: { age: { [op.gt]: 21 } } }) // 70