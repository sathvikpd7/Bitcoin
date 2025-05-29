import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import registerRoute from './routes/register.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/register', registerRoute);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.listen(5000, () => console.log('Server running on port 5000'));