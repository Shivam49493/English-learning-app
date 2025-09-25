import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import wordRouter from './routes/wordRoute.js';
import sentenceRouter from './routes/sentenceRoute.js';
import paragraphRouter from './routes/paragraphRoute.js';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config()
let app = express();
let PORT = process.env.PORT || 5000;

app.use(cookieParser());

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers)
}));

// Add security headers middleware


app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/words', wordRouter);
app.use('/api/sentences', sentenceRouter);
app.use('/api/paragraphs', paragraphRouter);




app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});