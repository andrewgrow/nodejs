'use strict';

// Основы выполнения запросов

// Создание экземпляра:
const john = await User.create({
  firstName: 'John',
  lastName: 'Smith',
})

// Создание экземпляра с определенными полями:
const user = await User.create(
    {
      username: 'John',
      isAdmin: true,
    },
    {
      fields: ['username'],
    }
)

console.log(user.username) // John
console.log(user.isAdmin) // false

// Обновление экземпляра:
// Изменяем имя пользователя с `userId = 2`
await User.update(
    {
      firstName: 'John',
    },
    {
      where: {
        userId: 2,
      },
    }
)

// Удаление пользователя с `id = 2`
await User.destroy({
  where: {
    userId: 2,
  },
})

// Удаление всех пользователей
await User.destroy({
  truncate: true,
})

// Создание нескольких экземпляров одновременно:
const users = await User.bulkCreate([{ name: 'John' }, { name: 'Jane' }])

// Настройка `validate` со значением `true` заставляет `Sequelize` выполнять валидацию каждого объекта, создаваемого с помощью `bulkCreate()`
// По умолчанию валидация таких объектов не проводится
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    validate: {
      len: [2, 10],
    },
  },
})

await User.bulkCreate([{ name: 'John' }, { name: 'J' }], { validate: true }) // Ошибка!

// Настройка `fields` позволяет определять поля для сохранения
await User.bulkCreate([{ name: 'John' }, { name: 'Jane', age: 30 }], {
  fields: ['name'],
}) // Сохраняем только имена пользователей

// Получение экземпляра:
// Получение одного (первого) пользователя
const firstUser = await User.find()

// Получение всех пользователей
const allUsers = await User.findAll() // SELECT * FROM ...;

// Выборка полей:
// Получение полей `foo` и `bar`
Model.findAll({
  attributes: ['foo', 'bar'],
}) // SELECT foo, bar FROM ...;

// Изменение имени поля `bar` на `baz`
Model.findAll({
  attributes: ['foo', ['bar', 'baz'], 'qux'],
}) // SELECT foo, bar AS baz, qux FROM ...;

// Выполнение агрегации
// Синоним `n_hats` является обязательным
Model.findAll({
  attributes: [
    'foo',
    [sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats'],
    'bar',
  ],
}) // SELECT foo, COUNT(hats) AS n_hats, bar FROM ...;
// instance.n_hats

// Сокращение - чтобы не перечислять все атрибуты при агрегации
Model.findAll({
  attributes: {
    include: [[sequelize.fn('COUNT', sequelize.col('hats')), 'n_hast']],
  },
})

// Исключение поля из выборки
Model.findAll({
  attributes: {
    exclude: ['baz'],
  },
})


// "Продвинутые" запросы:
Post.findAll({
  where: sequelize.where(
      sequelize.fn('char_length', sequelize.col('content')),
      7
  ),
}) // WHERE char_length('content') = 7

Post.findAll({
  where: {
    [Op.or]: [
      sequelize.where(sequelize.fn('char_length', sequelize.col('content')), 7),
      {
        content: {
          [Op.like]: 'Hello%',
        },
      },
      {
        [Op.and]: [
          { status: 'draft' },
          sequelize.where(
              sequelize.fn('char_length', sequelize.col('content')),
              {
                [Op.gt]: 8,
              }
          ),
        ],
      },
    ],
  },
})

/*
  ...
  WHERE (
    char_length("content") = 7
    OR
    "post"."content" LIKE 'Hello%'
    OR (
      "post"."status" = 'draft'
      AND
      char_length("content") > 8
    )
  )
*/