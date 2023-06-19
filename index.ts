import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import raffleRoutes from './src/routes/raffles';
import profilesRoutes from './src/routes/profiles';
import { Error } from './src/types/errors/errorTypes';
import { CustomError } from './src/utils/error';
import { scheduleAllRaffleEndJobs } from './src/utils/cronJobs';
import { validateEnvVars } from './src/utils/general';
import { errorHandler } from './src/middlewares/errorHandler';

require('dotenv').config();

validateEnvVars();

const app = express();
const port = process.env.PORT || 3001;

// Middleware initialization
function initializeMiddleware(app: express.Application) {
  app.use(cors());
  app.use(express.json());
}

// Database connection
async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

// Server listening
async function startServer() {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}

initializeMiddleware(app);
connectDatabase();
scheduleAllRaffleEndJobs();
app.use('/raffles', raffleRoutes);
app.use('/profiles', profilesRoutes);
app.use(errorHandler);

startServer();
