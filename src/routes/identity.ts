import express, { Request, Response } from 'express';
import { body, oneOf } from 'express-validator';

import { validateRequest } from '../middlewares';

const router = express.Router();

router.post(
  '/',
  oneOf([
    body('email').exists().isEmail(),
    body('phoneNumber').exists().isString().isNumeric(),
  ]),
  validateRequest,
  async (req: Request, res: Response) => {
    res.json({ ok: true });
  }
);

export { router as identityRouter };
