const SUCCESS_DATA_CODE = 200;
const SUCCESS_CREATION_CODE = 201;
const BAD_DATA_CODE = 400;
const BAD_DATA_MESSAGE = 'Переданы некорректные данные';
const NOT_FOUND_CODE = 404;
const NOT_FOUND_ROUTE_MESSAGE = 'Запрашиваемый ресурс не найден';
const SERVER_ERROR_CODE = 500;
const SERVER_ERROR_MESSAGE = 'Ошибка по умолчанию';
const CAST_ERROR_MESSAGE = 'Id юзера не валидный';
const urlPattern = /^(?:(?:https?|HTTPS?):\/\/)(www\.)?(\w|\W){1,}(\.[a-z]{2,6})((\w|\W){1,})?(#$)?/;

module.exports = {
  SUCCESS_DATA_CODE,
  SUCCESS_CREATION_CODE,
  BAD_DATA_CODE,
  BAD_DATA_MESSAGE,
  NOT_FOUND_CODE,
  NOT_FOUND_ROUTE_MESSAGE,
  SERVER_ERROR_CODE,
  SERVER_ERROR_MESSAGE,
  CAST_ERROR_MESSAGE,
  urlPattern,
};
