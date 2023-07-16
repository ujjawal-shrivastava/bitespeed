import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CustomError, RequestValidationError } from '../utils';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  next();
};

export const errorHandlers = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
  } else {
    console.log('Unknown error', err);
    res.status(400).send({
      errors: [
        {
          message: 'Something went wrong!',
        },
      ],
    });
  }
};
