const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  SUCCESS_DATA_CODE,
  BAD_DATA_CODE,
  BAD_DATA_MESSAGE,
  NOT_FOUND_CODE,
  NOT_FOUND_ROUTE_MESSAGE,
  SERVER_ERROR_CODE,
  SERVER_ERROR_MESSAGE,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: NOT_FOUND_ROUTE_MESSAGE });
      }
      return res.status(SUCCESS_DATA_CODE).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res
          .status(BAD_DATA_CODE)
          .send({ message: BAD_DATA_MESSAGE });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
    });
};

module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      req.body.password = hash;
      return User.create(req.body);
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_DATA_CODE)
          .send({ message: BAD_DATA_MESSAGE });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 360000,
        httpOnly: true,
      });
      res.status(200).send({ message: 'Авторизация успешна', token }); // не забыть сделать через куки
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send({ message: err.message });
    });
};

module.exports.userInfo = (req, res) => {
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_DATA_CODE)
          .send({ message: BAD_DATA_MESSAGE });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
    });
};
