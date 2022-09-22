/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/

export class CustomError extends Error {
  status: string;
  statusCode: number;

  constructor(status: string, statusCode: number, message: string) {
    super(message);

    this.status = status;
    this.statusCode = statusCode;

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  getErrorMessage() {
    return `${this.message} + ${this.status} + ${this.status}`;
  }
}
