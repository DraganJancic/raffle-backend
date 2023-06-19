import mongoose from "mongoose";
import { raffleSchema } from './raffle'

export default mongoose.model('CanceledRaffle', raffleSchema);
