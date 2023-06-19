import { Request, Response, NextFunction } from 'express';
import NftCollectionModel from '../schemas/db/nftCollection';

export const getAllNftCollections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collections = await NftCollectionModel.find({}).select('-_id -__v'); // here we are excluding properties "_id" and "__v"
    res.send(collections);
  } catch (err) {
    next(err);
  }
};

