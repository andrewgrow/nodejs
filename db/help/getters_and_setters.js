'use strict';

// Геттеры, сеттеры и виртуальные атрибуты
// Sequelize позволяет определять геттеры и сеттеры для атрибутов моделей, а также виртуальные атрибуты — атрибуты,
// которых не существует в таблице и которые заполняются или наполняются (имеется ввиду популяция)
// Serquelize автоматически. Последние могут использоваться, например, для упрощения кода.

// Геттер — это функция get(), определенная для колонки:
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        get() {
            const rawValue = this.getDataValue(username)
            return rawValue ? rawValue.toUpperCase() : null
        },
    },
})
// Геттер вызывается автоматически при чтении поля.
// Обратите внимание: для получения значения поля в геттере мы использовали метод getDataValue().
// Если вместо этого указать this.username, то мы попадем в бесконечный цикл.


// Сеттер — это функция set(), определенная для колонки. Она принимает значение для установки:
const User = sequelize.define('user', {
    username: DataTypes.STRING,
        password: {
        type: DataTypes.STRING,
            set(value) {
            // Перед записью в БД пароли следует "хэшировать" с помощью криптографической функции
            this.setDataValue('password', hash(value))
        },
    },
})
// Сеттер вызывается автоматически при создании экземпляра.

// В сеттере можно использовать значения других полей:
const User = sequelize.define('User', {
    username: DatTypes.STRING,
    password: {
        type: DataTypes.STRING,
        set(value) {
            // Используем значение поля `username`
            this.setDataValue('password', hash(this.username + value))
        },
    },
})


// Геттеры и сеттеры можно использовать совместно. Допустим, что у нас имеется модель Post с полем content
// неограниченной длины, и в целях экономии памяти мы решили хранить в БД содержимое поста в сжатом виде.
// Обратите внимание: многие современные БД выполняют сжатие (компрессию) данных автоматически.
const { gzipSync, gunzipSync } = require('zlib')

const Post = sequelize.define('post', {
    content: {
        type: DataTypes.TEXT,
        get() {
            const storedValue = this.getDataValue('content')
            const gzippedBuffer = Buffer.from(storedValue, 'base64')
            const unzippedBuffer = gunzipSync(gzippedBuffer)
            return unzippedBuffer.toString()
        },
        set(value) {
            const gzippedBuffer = gzipSync(value)
            this.setDataValue('content', gzippedBuffer.toString('base64'))
        },
    },
})


// Представим, что у нас имеется модель User с полями firstName и lastName, и мы хотим получать полное имя пользователя.
// Для этого мы можем создать виртуальный атрибут со специальным типом DataTypes.VIRTUAL:
const User = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    fullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.firstName} ${this.lastName}`
        },
        set(value) {
            throw new Error('Virtual attribute cannot be set.')
        },
    },
})
// В таблице не будет колонки fullName, однако мы сможем получать значение этого поля, как если бы оно существовало на самом деле.