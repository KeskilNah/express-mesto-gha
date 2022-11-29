const Card = require('../models/card');
const {
  SUCCESS_DATA_CODE,
} = require('../utils/constants');

const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

module.exports.getCards = (req, res, next) => {
  Card.find({}).populate('likes').populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const {
    name, link,
  } = req.body;
  Card.create({
    name, link, owner: req.user._id,
  })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const ownerId = req.user._id;
  Card.findById(req.params.cardId).populate('likes').populate('owner')
    .orFail(new NotFoundError(`Карточка с id ${req.params.cardId} не найдена`))
    .then((card) => {
      if (card.owner.toString() === ownerId) {
        card.delete()
          .then(() => res.status(SUCCESS_DATA_CODE).json({ message: `Карточка с id ${req.params.cardId} удалена` }));
      } else {
        throw new ForbiddenError('Это чужая карточка');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).populate('likes').populate('owner')
    .orFail(new NotFoundError(`Карточка с id ${req.params.cardId} не найдена`))
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).populate('likes').populate('owner')
    .orFail(new NotFoundError(`Карточка с id ${req.params.cardId} не найдена`))
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};
