import { Request, Response, NextFunction } from 'express';
import RaffleModel from '../schemas/db/raffle'
import { AccountModel } from '../schemas/db/account';
import { getSingleRaffleFromBlockchain } from '../utils/nearConnect'
import { buyTicketsSchema } from '../schemas/requests/requestSchemas'
import { BuyTicketsRequest } from '../types/requests/requestTypes'
import { CustomError } from '../utils/error'


//by ticket rest
export const buyTickets = async (req: Request, res: Response, next: NextFunction) => {

  // Validate the request body against the schema
  const { error } = buyTicketsSchema.validate(req.body, { convert: false });

  // If validation fails, throw a CustomError
  if (error) {
    const err = new CustomError('Invalid input', 400, error.details);
    return next(err);
  }

  // Extract raffle_id, account_id, and tickets from the request body
  const { raffle_id, account_id, tickets } = req.body as BuyTicketsRequest;

  try {

    let raffleBlockchainData;
    try {
      //nft-tst.testnet_2:5_ludikonj.testnet should be substituted with raffle_id
      raffleBlockchainData = await getSingleRaffleFromBlockchain("nft-tst.testnet_2:5_ludikonj.testnet")
    } catch (error) {
      raffleBlockchainData = null
    }

    // If raffle exists on the blockchain, if not return an error
    if (!raffleBlockchainData) {
      const err = new CustomError('Raffle doesn\'t exist', 400);
      return next(err);
    }

    // Fetch the raffle with the requested raffle_id from the database
    const raffle = await RaffleModel.findOne({ raffle_id });

    if (!raffle) {
      const err = new CustomError('Raffle does not exist', 404);
      return next(err);
    }

    // Check if the raffle has already ended
    if (raffle.raffle_ended) {
      const err = new CustomError('Raffle has already ended', 403);
      return next(err);
    }

    // Check if there are enough tickets available
    if (raffle.tickets_sold + tickets > raffle.total_tickets) {
      const err = new CustomError('Not enough tickets available', 400);
      return next(err);
    }

    // If the raffle exists, update the tickets sold and participants
    raffle.tickets_sold += tickets;

    if (!raffle.participants.includes(account_id)) {
      raffle.participants.push(account_id);
    }
    await raffle.save();

    // Fetch the account with the requested account_id from the database
    let account = await AccountModel.findOne({ account_id });

    // If the account doesn't exist, create a new one
    if (!account) {
      account = await AccountModel.create({
        account_id,
        raffles_created: [],
        raffles_canceled: [],
        participated_in: []
      });
    }

    // Update the account's participation in this raffle
    const participation = account.participated_in.find(p => p.raffle_id === raffle_id);
    if (participation) {
      participation.total_tickets += tickets;
      participation.total_tickets_value += tickets * raffle.ticket_price;
    } else {
      account.participated_in.push({
        raffle_id,
        total_tickets: tickets,
        total_tickets_value: tickets * raffle.ticket_price,
        winner: false
      });
    }
    await account.save();

    // Send a 200 status response with the updated raffle and account information
    res.status(200).json({ raffle, account });

  } catch (error) {
    // If any error occurs, pass it to the next function in the middleware chain
    return next(error);
  }
};