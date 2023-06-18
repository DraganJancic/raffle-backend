import { Request, Response, NextFunction } from 'express';
import { AccountModel } from '../schemas/db/account'
import { CustomError } from '../utils/error'

export const getProfileInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Destructure account_id from the request params
    const { accountId } = req.params;
    console.log(req.params)

    // Query the database for the account with the provided account_id
    const account = await AccountModel.findOne({ account_id: accountId });

    // If the account does not exist, create a custom error and pass it to the next middleware
    if (!account) {
      const err = new CustomError('Account not found', 404);
      return next(err);
    }

    // Respond to the client with the account data
    res.status(200).json(account);
  } catch (error) {
    // If any errors occurred, pass them to the next middleware
    return next(error);
  }
};

