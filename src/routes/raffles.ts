import express from 'express';
import { createRaffle } from '../controllers/createRaffle';
import { buyTickets } from '../controllers/buyTickets';
import { cancelRaffle } from '../controllers/cancelRaffle';
import { getFeaturedRaffles } from '../controllers/getFeaturedRaffles';
import { getPastRaffles } from '../controllers/getPastRaffles';
import { getCurrentRaffles } from '../controllers/getCurrentRaffles';
import { getAllNftCollections } from '../controllers/getAllNftCollections'

const router = express.Router();

// Route for fetching current raffles
router.post('/current', getCurrentRaffles);

// Route for fetching featured raffless
router.get('/featured', getFeaturedRaffles);

// Route for fetching past raffles
router.post('/past', getPastRaffles);

// Route for adding raffles
router.post('/create-raffle', createRaffle);

// Route for buying tickets
router.post('/buy-tickets', buyTickets)

// Route for canceling raffle
router.post('/cancel-raffle', cancelRaffle)

// Route for fetching all collections involved in raffles
router.get('/collections', getAllNftCollections)


export default router;
