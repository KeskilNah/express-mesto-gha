class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'authorizationError';
    this.statusCode = 401;
  }
}

module.exports = AuthorizationError;
