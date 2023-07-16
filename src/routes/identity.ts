import express, { Request, Response } from 'express';
import { body, oneOf } from 'express-validator';

import { validateRequest } from '../middlewares';

const router = express.Router();

router.post(
  '/',
  [
    oneOf([body('email').exists(), body('phoneNumber').exists()], {
      message: 'either email or phoneNumber is required',
    }),

    body('email').optional().isEmail(),
    body('phoneNumber').optional().isString().isNumeric(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.json({ ok: true });
  }
);

export { router as identityRouter };
