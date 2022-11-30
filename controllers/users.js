const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');
const ExistEmailError = require('../errors/ExistEmail');
const NotFoundError = require('../errors/NotFoundError');
const User = require('../models/user');
const {
  SUCCESS_DATA_CODE,
  BAD_DATA_MESSAGE,
  SUCCESS_CREATION_CODE,
  CAST_ERROR_MESSAGE,
} = require('../utils/constants');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId).orFail(new NotFoundError(`Пользователь с id ${req.params.userId} не найден`))
    .then((user) => res.status(SUCCESS_DATA_CODE).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(CAST_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((document) => {
      const user = document.toObject();
      delete user.password;
      res.status(SUCCESS_CREATION_CODE).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ExistEmailError('Такой email уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_DATA_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_DATA_MESSAGE));
      } else if (err.name === 'CastError') {
        next(new BadRequestError(CAST_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  ).orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_DATA_MESSAGE));
      } else if (err.name === 'CastError') {
        next(new BadRequestError(CAST_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  User.findUserByCredentials(req.body)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(SUCCESS_DATA_CODE).send({ token });
    })
    .catch(next);
};

module.exports.userInfo = (req, res, next) => {
  User.findById(
    req.user._id,
  ).orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(CAST_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};
