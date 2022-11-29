const { celebrate } = require('celebrate');
const Joi = require('joi');
const { urlPattern } = require('./constants');

module.exports.getUserByIdCelebrate = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

module.exports.updateUserCelebrate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.updateAvatarCelebrate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(urlPattern),
  }),
});

module.exports.createCardCelebrate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(urlPattern),
  }),
});

module.exports.deleteCardCelebrate = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports.likeCardCelebrate = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports.dislikeCardCelebrate = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports.loginCelebrate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.createUserCelebrate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlPattern),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});
