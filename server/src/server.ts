import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { usersRouter, postsRouter, authRouter } from './routes/index.js';

import { sleep } from './sleep.js';

const server = express();

server.use(json(), cookieParser(), cors(), sleep([400, 1500]));

server.get('/', (req, res) => {
  res.send('Server is running! 🚀');
});

server.use('/users', usersRouter);

server.use('/posts', postsRouter);

server.use('/', authRouter);

server.listen(4000, () => {
  console.log('Server started on port 4000');
});
