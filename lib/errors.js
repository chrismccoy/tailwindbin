/**
 * Domain-specific error types.
 */

/**
 * Base application error with an associated HTTP status code.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

/**
 * Represents a 404 Not Found condition.
 */
class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

/**
 * Represents a 422 Unprocessable condition.
 */
class ValidationError extends AppError {
  constructor(message = "Invalid input") {
    super(message, 422);
  }
}

/**
 * Represents a 429 Too Many Requests condition.
 */
class RateLimitError extends AppError {
  constructor(windowMs) {
    const minutes = Math.ceil(windowMs / 60000);
    super(
      `You've hit the rate limit. Please try again in ${minutes} minutes.`,
      429
    );
  }
}

module.exports = { AppError, NotFoundError, ValidationError, RateLimitError };
