const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');
const ExistEmailError = require('../errors/ExistEmail');
const User = require('../models/user');
const {
  SUCCESS_DATA_CODE,
  BAD_DATA_CODE,
  BAD_DATA_MESSAGE,
  NOT_FOUND_CODE,
  NOT_FOUND_ROUTE_MESSAGE,
  SERVER_ERROR_CODE,
  SERVER_ERROR_MESSAGE,
  SUCCESS_CREATION_CODE,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE }));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next();
      }
      return res.status(SUCCESS_DATA_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'BadRequestError') {
        return res
          .status(BAD_DATA_CODE)
          .send({ message: BAD_DATA_MESSAGE });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
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

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((users) => {
      if (!users) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: NOT_FOUND_ROUTE_MESSAGE });
      }
      return res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_DATA_CODE)
          .send({ message: BAD_DATA_MESSAGE });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((users) => {
      if (!users) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: NOT_FOUND_ROUTE_MESSAGE });
      }
      return res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_DATA_CODE)
          .send({ message: BAD_DATA_MESSAGE });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
    });
};

module.exports.login = (req, res, next) => {
  User.findUserByCredentials(req.body)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).send({ token });
    })
    .catch(next);
};

module.exports.userInfo = (req, res, next) => {
  User.findById(
    req.user._id,
  )
    .then((users) => {
      if (!users) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: NOT_FOUND_ROUTE_MESSAGE });
      }
      return res.send({ data: users });
    })
    .catch(next);
};
