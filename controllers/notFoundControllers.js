const NotFoundError = require('../errors/NotFoundError');
const { NOT_FOUND_ROUTE_MESSAGE } = require('../utils/constants');

module.exports.notFoundControllers = (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_ROUTE_MESSAGE));
};
