class NotFound extends Error {
  constructor(message) {
    super(message);
    this.state = 404;
  }
}

module.exports = NotFound;
