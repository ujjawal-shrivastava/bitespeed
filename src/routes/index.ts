import express, { Request, Response } from 'express';

import { identityRouter } from './identity';

const appRouter = express.Router();

appRouter.get('/', async (req: Request, res: Response) => {
  res.send('I am up and runing!');
});

appRouter.use('/identify', identityRouter);

export default appRouter;
