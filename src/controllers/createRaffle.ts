import { Request, Response } from 'express';
import { Raffle } from '../types/raffle';
import fs from 'fs';
import path from 'path';

export const createRaffle = (req: Request, res: Response) => {
  const raffleData: Omit<Raffle, 'raffle_id'> = req.body;

  if (!raffleData.nft_id || !raffleData.ticket_cost) {
    return res.status(400).json({ message: 'Invalid raffle data' });
  }

  try {
    const rafflesFilePath = path.join(__dirname, '..', 'dummy-data', 'raffle.json');


    const raffles = JSON.parse(fs.readFileSync(rafflesFilePath, 'utf8'));

    // Check if a raffle with the given nft_id already exists
    if (raffles.some((raffle: Raffle) => raffle.nft_id === raffleData.nft_id)) {
      return res.status(400).json({ message: 'A raffle with this NFT ID already exists' });
    }

    // Generate the raffle_id
    const maxRaffleId = Math.max(...raffles.map((raffle: Raffle) => raffle.raffle_id), 0);
    const newRaffle: Raffle = { raffle_id: maxRaffleId + 1, ...raffleData };

    // Add the new raffle
    raffles.push(newRaffle);
    fs.writeFileSync(rafflesFilePath, JSON.stringify(raffles, null, 2));

    res.status(201).json({ message: 'Raffle added successfully', raffle: newRaffle });
  } catch (error) {
    res.status(500).json({ message: 'Error adding raffle: ' + error.message });
  }
};
