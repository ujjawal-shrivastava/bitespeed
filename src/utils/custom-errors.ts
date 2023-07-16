import { FieldValidationError, ValidationError } from 'express-validator';

// * Base custom error
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): {
    message: string;
    field?: string;
    code?: string;
    description?: string;
  }[];
}

// * Path not found error
export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor() {
    super('Route not found!');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not found' }];
  }
}

// * Validation error
export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters!');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      return {
        message: error.msg,
        field: error.type === 'field' ? error.path : undefined,
      };
    });
  }
}

// * Bad request error
export class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(
    public error: { code: string; message: string; description?: string }
  ) {
    super(error.message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [this.error];
  }
}

// * Internal error
export class InternalError extends CustomError {
  statusCode = 500;

  constructor(message?: string) {
    super(message || 'Something went wrong!');
    Object.setPrototypeOf(this, InternalError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message || 'Something went wrong!' }];
  }
}
