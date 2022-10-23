const Card = require('../models/card');
const {
  BAD_DATA_CODE,
  BAD_DATA_MESSAGE,
  NOT_FOUND_CODE,
  NOT_FOUND_ROUTE_MESSAGE,
  SERVER_ERROR_CODE,
  SERVER_ERROR_MESSAGE,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE }));
};

module.exports.createCard = (req, res) => {
  const {
    name, link,
  } = req.body;
  Card.create({
    name, link, owner: req.user._id,
  })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_DATA_CODE)
          .send({ message: BAD_DATA_MESSAGE });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_ROUTE_MESSAGE });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_DATA_CODE)
          .send({ message: BAD_DATA_MESSAGE });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_ROUTE_MESSAGE });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_DATA_CODE)
          .send({ message: BAD_DATA_MESSAGE });
      }
      return res.status(SERVER_ERROR_CODE).send({ mmessage: SERVER_ERROR_MESSAGE });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_ROUTE_MESSAGE });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_DATA_CODE)
          .send({ message: BAD_DATA_MESSAGE });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
    });
};
