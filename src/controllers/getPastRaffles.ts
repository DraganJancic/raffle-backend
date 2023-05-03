import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const getPastRaffles = (req: Request, res: Response) => {
  const raffles = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'dummy-data', 'raffle.json'), 'utf8'));

  // Get the current timestamp
  const currentTime = new Date().getTime();

  // Filter raffles based on the end_date property being less than the current time
  const pastRaffles = raffles.filter((raffle: any) => {
    const endDate = new Date(raffle.end_date).getTime();
    return endDate < currentTime;
  });

  res.status(200).json(pastRaffles);
};
