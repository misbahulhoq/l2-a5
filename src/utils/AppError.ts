export class AppError extends Error {
  readonly statusCode: number;
  readonly status: string;
  readonly isOperational: boolean;
  constructor(statusCode = 500, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
