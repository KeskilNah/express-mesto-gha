const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Ошибка по умолчанию" }));
};

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link, likes, createdAt } = req.body;
  Card.create({ name, link, owner: req.user._id, likes, createdAt })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};

module.exports.deleteCard = (req, res) => {
  console.log(req.params.cardId);
  Card.findByIdAndRemove(req.params.cardId)
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      return res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};

module.exports.likeCard = (req, res) => {
  console.log(req.params.cardId);
  console.log(req.user._id);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFound("Краточка не найдена");
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      return res.status(500).send({ mmessage: "Ошибка по умолчанию" });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFound("Краточка не найдена");
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      return res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};
