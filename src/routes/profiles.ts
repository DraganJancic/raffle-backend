import express from 'express';
import { getProfileInfo } from '../controllers/getProfileInfo';

const router = express.Router();

router.get('/:accountId', getProfileInfo);

export default router;
