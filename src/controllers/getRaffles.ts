import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const getRaffles = (req: Request, res: Response) => {
  const raffles = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'dummy-data', 'raffle.json'), 'utf8'));
  res.json(raffles);
};
