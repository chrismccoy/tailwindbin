/**
 * Error handling middleware.
 */

const { AppError } = require("../lib/errors");

const ERROR_MAP = {
  403: {
    heading: "Forbidden",
    message: "You do not have permission to perform this action.",
  },
  404: {
    heading: "Page Not Found",
    message:
      "The paste you're looking for doesn't exist or has expired.",
  },
  422: {
    heading: "Invalid Input",
  },
  429: { heading: "Too Many Requests" },
  500: {
    heading: "Internal Server Error",
    message: "Something unexpected went wrong. We're working on it.",
  },
};

const errorHandler = (err, _req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof AppError) {
    const defaults = ERROR_MAP[err.statusCode] || ERROR_MAP[500];
    return res.status(err.statusCode).render("error", {
      code: err.statusCode,
      heading: defaults.heading,
      message: err.message || defaults.message,
    });
  }

  console.error(err.stack);
  const info = ERROR_MAP[500];
  res.status(500).render("error", {
    code: 500,
    heading: info.heading,
    message: info.message,
  });
};

const notFoundHandler = (_req, res) => {
  const info = ERROR_MAP[404];
  res.status(404).render("error", {
    code: 404,
    heading: info.heading,
    message: info.message,
  });
};

module.exports = { errorHandler, notFoundHandler };
