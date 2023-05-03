import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const deleteRaffle = (req: Request, res: Response) => {
  const raffleId = parseInt(req.params.id, 10);

  // Read existing raffle data
  const raffles = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', 'dummy-data', 'raffle.json'), 'utf8'));

  // Find the raffle by its ID
  const raffleIndex = raffles.findIndex((raffle: any) => raffle.raffle_id === raffleId);

  if (raffleIndex === -1) {
    return res.status(404).json({ message: 'Raffle not found' });
  }

  // Remove the raffle from the array
  raffles.splice(raffleIndex, 1);

  // Save updated raffle data back to raffle.json
  fs.writeFileSync(path.resolve(__dirname, '..', '..', 'dummy-data', 'raffle.json'), JSON.stringify(raffles, null, 2));

  res.status(200).json({ message: 'Raffle deleted successfully' });
};
