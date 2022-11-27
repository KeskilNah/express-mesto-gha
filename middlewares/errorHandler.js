module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Неизвестная ошибка сервера'
      : message,
  });
  // вызываем next так как без него код замыкается //
  next();
};
