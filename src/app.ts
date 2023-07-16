import express, { json, urlencoded } from 'express';
import appRouter from './routes';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(appRouter);

app.all('*', async () => {
  // TODO custom error methods
  throw new Error('Route not found');
});

// TODO add error handler

export default app;
