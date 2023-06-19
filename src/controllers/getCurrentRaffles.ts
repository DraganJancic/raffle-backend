import { Request, Response, NextFunction } from 'express';
import RaffleModel from '../schemas/db/raffle'
import { getCurrentRafflesSchema } from '../schemas/requests/requestSchemas'
import { CustomError } from '../utils/error'

type SortOptionKey = 'recent' | 'expiring' | 'sellingOut' | 'priceLH' | 'priceHL' | 'floorLH' | 'floorHL';
type SortOption = { field: string; order: number; };

export const getCurrentRaffles = async (req: Request, res: Response, next: NextFunction) => {
  // Validate the request body against the Joi schema
  const { error } = getCurrentRafflesSchema.validate(req.body);

  // If the validation failed, create a custom error and pass it to the next middleware
  if (error) {
    const err = new CustomError('Invalid input', 400, error.details);
    return next(err);
  }

  // Destructure the sort, filters, and page properties from the request body
  // If the page property is not provided, default to 1
  const { sort, filters, page = 1 } = req.body;

  // Define the number of raffles per page
  const limit = 10;

  // Compute the number of raffles to skip based on the current page number
  const skip = (page - 1) * limit;

  const SORT_OPTIONS: Record<SortOptionKey, SortOption> = {
    'recent': { field: 'start_date', order: -1 },
    'expiring': { field: 'end_date', order: 1 },
    'sellingOut': { field: 'tickets_sold', order: -1 },
    'priceLH': { field: 'ticket_price', order: 1 },
    'priceHL': { field: 'ticket_price', order: -1 },
    'floorLH': { field: 'floor_price', order: 1 },
    'floorHL': { field: 'floor_price', order: -1 },
  };

  // Use the sort property to set the sort query
  let sortQuery = {};

  // Initialize the sort query for the MongoDB find method
  if (sort && SORT_OPTIONS[sort as SortOptionKey]) {
    const { field, order } = SORT_OPTIONS[sort as SortOptionKey];
    sortQuery = { [field]: order };
  }

  // Initialize the filter query for the MongoDB find method with raffle_ended: false
  const filterQuery: any = { raffle_ended: false };

  // If the filters object includes the collection property, add it to the filter query
  if (filters.collection) {
    filterQuery.nft_collection = filters.collection;
  }

  // If the filters object includes the floor property and either of its min or max properties,
  // Add a condition to the filter query for the floor_price to be within the provided range
  if (filters.floor && (filters.floor.min || filters.floor.max)) {
    filterQuery.floor_price = {};
    if (filters.floor.min) {
      filterQuery.floor_price.$gte = filters.floor.min;
    }
    if (filters.floor.max) {
      filterQuery.floor_price.$lte = filters.floor.max;
    }
  }

  // If the filters object includes the end_date property, add it to the filter query
  if (filters.end_date) {
    filterQuery.end_date = { $lte: new Date(filters.end_date) };
  }

  try {
    // Query the database for raffles that match the filter query
    // Skip the correct amount of raffles based on the page number
    // Limit the number of raffles fetched to the defined limit
    // Sort the raffles based on the sort query
    // Populate the nft_collection field
    const raffles = await RaffleModel.find(filterQuery)
      .populate('nft_collection')
      .skip(skip)
      .limit(limit)
      .sort(sortQuery)
      .exec();

    // Map over the raffles to include the new fields in the response
    const rafflesWithCollectionData = raffles.map((raffle: any) => {
      const { nft_collection, _id, __v, ...raffleWithoutCollection } = raffle._doc;
      return {
        ...raffleWithoutCollection,
        collection_id: nft_collection.collection_id,
        collection_name: nft_collection.collection_name,
        floor_price: nft_collection.latest_floor_price,
      };
    });

    // Respond to the client with the fetched raffles
    res.status(200).json(rafflesWithCollectionData);
  } catch (error) {
    // If any errors occurred, pass them to the next middleware
    return next(error);
  }

};

