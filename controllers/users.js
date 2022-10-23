const User = require("../models/user");
const NotFound = require("../errors/NotFound");
const ValidationError = require("../errors/ValidationError");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: "Ошибка по умолчанию" }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Пользователь по указанному id не найден" });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  console.log(req.user._id);
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((users) => {
      if (!users) {
        return res
          .status(404)
          .send({ message: "Пользователь по указанному id не найден" });
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  console.log(req.user._id);
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((users) => {
      if (!users) {
        return res
          .status(404)
          .send({ message: "Пользователь по указанному id не найден" });
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};
