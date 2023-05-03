import express from 'express';
import cors from 'cors';
import raffleRoutes from './src/routes/raffles';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Use raffle routes
app.use('/raffles', raffleRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
