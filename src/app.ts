import express, { json, urlencoded } from 'express';
import appRouter from './routes';
import { NotFoundError } from './utils';
import { errorHandlers } from './middlewares';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(appRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandlers);

export default app;
