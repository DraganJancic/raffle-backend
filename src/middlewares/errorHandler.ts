import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/error';

export const errorHandler = (err: CustomError | Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err instanceof CustomError) {
    res.status(err.status).send({ message: err.message, details: err.details });
  } else {
    res.status(500).send({ message: 'Server Error', details: err.message });
  }
};