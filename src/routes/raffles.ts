import express from 'express';
import { getRaffles } from '../controllers/getRaffles';
import { createRaffle } from '../controllers/createRaffle';
import { deleteRaffle } from '../controllers/deleteRaffle';
import { getFeaturedRaffles } from '../controllers/getFeaturedRaffles';
import { getPastRaffles } from '../controllers/getPastRaffles';

const router = express.Router();

// Route for fetching raffle list data
router.get('/', getRaffles);

// Route for fetching featured raffles
router.get('/featured', getFeaturedRaffles);

// Route for fetching past raffles
router.get('/past', getPastRaffles);

// Add route for adding raffles
router.post('/create-raffle', createRaffle);

//Delete raffle by id
router.delete('/:id', deleteRaffle);

export default router;
