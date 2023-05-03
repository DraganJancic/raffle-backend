import express from 'express';
import { getRaffles } from '../controllers/getRaffles';
import { createRaffle } from '../controllers/createRaffle';
import { deleteRaffle } from '../controllers/deleteRaffle';

const router = express.Router();

// Route for fetching raffle list data
router.get('/', getRaffles);

// Add route for adding raffles
router.post('/create-raffle', createRaffle);

//Delete raffle by id
router.delete('/raffles/:id', deleteRaffle);

export default router;
