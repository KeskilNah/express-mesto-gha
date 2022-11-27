const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const AuthorizationError = require('../errors/AuthorizationError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => /^(?:(?:https?|HTTPS?):\/\/)(www\.)?(\w|\W){1,}(\.[a-z]{2,6})((\w|\W){1,})?(#$)?/.test(v),
      message: 'Неправильный формат ссылки для аватара',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  varsionKey: false,
  statics: {
    findUserByCredentials({ email, password }) {
      return this.findOne({ email }).select('+password')
        .then((document) => {
          if (!document) {
            throw new AuthorizationError('Неправильные почта или пароль');
          }
          return bcrypt.compare(password, document.password)
            .then((matched) => {
              if (!matched) {
                throw new AuthorizationError('Неправильные почта или пароль');
              }
              const user = document.toObject();
              return user;
            });
        });
    },
  },
});

module.exports = mongoose.model('user', userSchema);
