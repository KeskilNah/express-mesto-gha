const { NOT_FOUND_CODE, NOT_FOUND_ROUTE_MESSAGE } = require('../utils/constants');

module.exports.notFoundControllers = (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_ROUTE_MESSAGE });
};
