import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;  
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

import userRoutes from './router/user.route.js';
import messageRoutes from './router/message.route.js';
import aiRoutes from './router/ai.route.js';

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);

export default app;