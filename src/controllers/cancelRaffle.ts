import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import RaffleModel from '../schemas/db/raffle'
import CanceledRaffleModel from '../schemas/db/canceledRaffle'
import { getSingleRaffleFromBlockchain } from '../utils/nearConnect'
import { cancelRaffleSchema } from '../schemas/requests/requestSchemas'
import { CancelRaffleRequest } from '../types/requests/requestTypes'
import { CustomError } from '../utils/error'

export const cancelRaffle = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = cancelRaffleSchema.validate(req.body);

  if (error) {
    const err = new CustomError('Invalid input', 400, error.details);
    return next(err);
  }

  const { raffle_id, account_id } = req.body as CancelRaffleRequest;

  const session = await mongoose.startSession();

  // Start a new session for the transaction
  // This enables to do a series of operations atomically (all or none)
  session.startTransaction();

  try {
    let raffleBlockchainData;
    try {
      // Try to get raffle data from the blockchain
      raffleBlockchainData = await getSingleRaffleFromBlockchain(raffle_id)
    } catch (error) {
      raffleBlockchainData = null
    }

    // If raffle still exists on the blockchain, return an error
    if (raffleBlockchainData) {
      const err = new CustomError('Raffle still exists on the blockchain', 400);
      return next(err);
    }

    // Retrieve the raffle from the database
    const raffle = await RaffleModel.findOne({ raffle_id });

    // If raffle does not exist in the database, return an error
    if (!raffle) {
      const err = new CustomError('Raffle does not exist', 404);
      return next(err);
    }

    // If the raffler is not the same as the account_id, return an error
    if (raffle.raffler !== account_id) {
      const err = new CustomError('Only the creator can cancel the raffle', 403);
      return next(err);
    }

    // If there are sold tickets, the raffle cannot be canceled
    if (raffle.tickets_sold > 0) {
      const err = new CustomError('Cannot cancel raffle, tickets have been sold', 403);
      return next(err);
    }

    // Create a new CanceledRaffleModel document from the raffle document
    // toObject() is used to disconnect it from the original Mongoose document
    // in order to prevent potential issues when saving it into a different collection and deleting it at the same time.
    // If it is not disconected we got error: "VersionError: No matching document found for id...",
    // looks like it is mongoose issu, should investigate a bit more at some point, for now we could use this hack
    const canceledRaffle = new CanceledRaffleModel(raffle.toObject());

    // Save the canceled raffle to the new collection within the same session
    await canceledRaffle.save({ session });

    // Delete the original raffle also within the same session
    await RaffleModel.deleteOne({ raffle_id }, { session });

    // If everything has been successful, commit the transaction
    await session.commitTransaction();

    res.status(200).json({ message: 'Raffle canceled successfully' });
  } catch (error) {
    // If any error occurs during the transaction, abort it
    if (session?.inTransaction()) {
      session.abortTransaction();
    }
    return next(error);
  } finally {
    // Whether the transaction is successful or not, always end the session
    session.endSession();
  }
};

