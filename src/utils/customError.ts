/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/

export class CustomError extends Error {
  status: string | number;
  statusCode: number;
  isOperation: boolean;

  constructor(status: string, statusCode: number, message: string) {
    super(message);

    this.status = `${status}`.startsWith("4") ? "fail" : "error";
    this.statusCode = statusCode;
    this.isOperation = true;

    // 👇️ because we are extending a built-in class
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  getErrorMessage() {
    return `${this.message} + ${this.status} + ${this.status}`;
  }
}
