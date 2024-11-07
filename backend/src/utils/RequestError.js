class RequestError extends Error {
  constructor(code, message) {
    super(message);

    this.code = code;
  }

  format() {
    const { code, message } = this;

    return `${code} - ${message}`;
  }
}

module.exports = { RequestError };