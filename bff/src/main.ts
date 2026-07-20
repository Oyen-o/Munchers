import express from 'express';
import cors from 'cors';
import { initializeCosmosDB } from './db/cosmos';
import userRoutes from './routes/users';
import groupRoutes from './routes/groups';
import eventRoutes from './routes/events';
import commentRoutes from './routes/comments';
import ratingRoutes from './routes/ratings';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/', (req, res) => {
  res.send({ message: 'Munchers BFF API' });
});

// Start server (Cosmos DB initialization skipped for local development)
console.warn('⚠️  Cosmos DB initialization skipped - database operations will not work');
console.warn('⚠️  Configure COSMOS_ENDPOINT, COSMOS_KEY, and COSMOS_DATABASE_ID in .env to enable database');

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

// Uncomment below to enable Cosmos DB:
// initializeCosmosDB()
//   .then(() => {
//     app.listen(port, host, () => {
//       console.log(`[ ready ] http://${host}:${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error('Failed to initialize Cosmos DB:', error);
//     process.exit(1);
//   });
