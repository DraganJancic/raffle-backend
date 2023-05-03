import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const getFeaturedRaffles = (req: Request, res: Response) => {
  const raffles = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'dummy-data', 'raffle.json'), 'utf8'));

  // Filter or select raffles to be featured (refactor the logic as needed)
  const featuredRaffles = raffles.slice(0, 5);

  res.status(200).json(featuredRaffles);
};
