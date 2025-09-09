import { Request, Response, NextFunction } from 'express';

import {
  checkOtpRestrictions,
  sendOtp,
  trackOTPRequests,
  validateRegistrationData,
} from '../utils/auth.helper';
import { prisma } from 'packages/libs/prisma';
import { ValidationError } from '@error-handler';

// register a new user
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, 'user');

    const { name, email } = req.body;
    const existingUser = await prisma.users.findUnique({ where: email });

    if (existingUser) {
      return next(new ValidationError('User Already exists with this email!'));
    }

    await checkOtpRestrictions(email, next);
    await trackOTPRequests(email, next);
    await sendOtp(email, name, 'user-activation-email');

    res
      .status(200)
      .json({ message: 'OTP sent to email. Please verify your account.' });
  } catch (error) {
    return next(error);
  }
};
