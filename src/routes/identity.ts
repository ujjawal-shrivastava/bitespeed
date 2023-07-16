import express, { Request, Response } from 'express';
import { body, oneOf } from 'express-validator';

import { validateRequest } from '../middlewares';
import { Formatters } from '../utils';
import contactController from '../controllers/contact-controller';

const router = express.Router();

router.post(
  '/',
  [
    oneOf([body('email').exists(), body('phoneNumber').exists()], {
      message: 'either email or phoneNumber is required',
    }),
    body('email').optional().isEmail(),
    body('phoneNumber').optional({ nullable: true }).isString().isNumeric(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { phoneNumber, email } = req.body;

    const newContact = await contactController.Create.newLinked(
      phoneNumber,
      email
    );

    res.json(Formatters.postIdentify(newContact));
  }
);

export { router as identityRouter };
