import { errorHandler } from "../middlewares/error.middlewares.js";
import { ApiError } from "./ApiError.js";
/**
 * @description Common Error class to throw an error from anywhere.
 * The {@link errorHandler} middleware will catch this error at the central place and it will return an appropriate response to the client
 */
class SSOError extends ApiError {
  /**
   *
   * @param {number} statusCode
   * @param {string} message
   * @param {any[]} errors
   * @param {string} stack
   */
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(statusCode, message, errors, stack);
    this.name = this.constructor.name;
  }
}

export { SSOError };
