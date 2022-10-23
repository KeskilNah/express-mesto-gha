class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.state = 400;
  }
}

module.exports = ValidationError;
