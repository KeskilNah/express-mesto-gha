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
    .orFail(new NotFound("Пользователь не найден"))
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      const { status = 500, message = "Ошибка по умолчанию" } = err;
      if (err.name === "CastError") {
        return res
          .status(404)
          .send({ message: "Переданы некорректные данные" });
      }
      res.status(status).send({ message });
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
  User.findByIdAndUpdate(req.user._id, { name: name, about: about })
    .orFail(new NotFound("Пользователь не найден"))
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      const { status = 500, message = "Ошибка по умолчанию" } = err;
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      res.status(status).send({ message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  console.log(req.user._id);
  User.findByIdAndUpdate(req.user._id, { avatar: avatar })
    .orFail(new NotFound("Пользователь не найден"))
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      const { status = 500, message = "Ошибка по умолчанию" } = err;
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      res.status(status).send({ message });
    });
};
