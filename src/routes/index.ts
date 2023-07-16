import express from 'express';

import { identityRouter } from './identity';

const appRouter = express.Router();

appRouter.use('/identify', identityRouter);

export default appRouter;
