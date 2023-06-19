import { Request, Response, NextFunction } from 'express';
import RaffleModel from '../schemas/db/raffle'
import { AccountModel } from '../schemas/db/account';
import { getSingleRaffleFromBlockchain } from '../utils/nearConnect'
import { createRaffleSchema } from '../schemas/requests/requestSchemas'
import { CreateRaffleRequest } from '../types/requests/requestTypes'
import { getNftDataFromIndexer } from '../utils/indexerXyzCalls'
import { CustomError } from '../utils/error'
import { createRaffleEndJob } from '../utils/cronJobs'
import { getPriceInNearFromYoctoNumber } from '../utils/general'
import NftCollectionModel from '../schemas/db/nftCollection';

export const createRaffle = async (req: Request, res: Response, next: NextFunction) => {

  const { error } = createRaffleSchema.validate(req.body);

  if (error) {
    const err = new CustomError('Invalid request body', 400, error.details);
    return next(err);
  }

  // Body has the correct shape, proceed 
  const { raffle_id, contract_id, account_id, token_id, supply, end_date, ticket_price } = req.body as CreateRaffleRequest

  try {

    // here we should check if raffle was created on blockchain before we proceed
    // should substitute 'nft-tst.testnet_2:5_ludikonj.testnet' with raffle_id from the request
    let raffleBlockchainData;
    try {
      raffleBlockchainData = await getSingleRaffleFromBlockchain("nft-tst.testnet_2:5_ludikonj.testnet")
    } catch (error) {
      raffleBlockchainData = null
    }

    // If raffle exists on the blockchain, if not return an error
    if (!raffleBlockchainData) {
      const err = new CustomError('Raffle does not exist', 404);
      return next(err);
    }

    if (raffleBlockchainData) {
      // get NFT data from indexer.xyz
      const { data: { near: { nfts } } } = await getNftDataFromIndexer(token_id, contract_id)
      const nftData = nfts[0]

      let current_datetime: Date = new Date();

      // Check if the NFT Collection exists in the database.
      let nftCollection = await NftCollectionModel.findOne({ collection_id: contract_id });

      if (!nftCollection) {
        // If the NFT Collection does not exist, create it.
        nftCollection = await NftCollectionModel.create({
          collection_id: contract_id,
          collection_name: nftData.collection.title,
          latest_floor_price: getPriceInNearFromYoctoNumber(nftData.collection.floor),
        });
      } else {
        // If the NFT Collection exists, update it.
        nftCollection.latest_floor_price = getPriceInNearFromYoctoNumber(nftData.collection.floor);
        nftCollection = await nftCollection.save();
      }

      // add raffle to database
      const createdRaffle = await RaffleModel.create({
        raffle_id,
        raffler: account_id,
        total_tickets: supply,
        ticket_price: ticket_price,
        start_date: current_datetime,
        end_date: end_date,
        nft_collection: nftCollection._id,
        nft_id: token_id,
        nft_title: nftData.name,
        image_url: nftData.media_url,
        floor_price: getPriceInNearFromYoctoNumber(nftData.collection.floor),
      })

      // update or create account
      // Find account
      let account = await AccountModel.findOne({ account_id });

      if (!account) {
        // If account does not exist, create it
        account = await AccountModel.create({
          account_id,
          raffles_created: [raffle_id],  // first raffle created
        });
      } else {
        // If account exists, update it
        // Add the new raffle id to the raffles_created array
        if (!account.raffles_created.includes(raffle_id)) {
          account.raffles_created.push(raffle_id);
          account = await account.save();
        }
      }

      // Create cron job that notifies blockchain and updates db on raffle end
      // createRaffleEndJob(raffle_id, end_date)
      createRaffleEndJob(raffle_id, new Date(end_date))

      res.status(200).json({ createdRaffle, account })
    } else {
      throw new CustomError("Raffle already created!", 409);
    }

  } catch (error) {
    next(error);
  }

};