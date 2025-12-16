import { NextFunction, Request, Response } from 'express';
import emailValidationPattern from '../utils/emailValidationPattern';

async function verifyUserCredentials(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }

  if (!emailValidationPattern.emailValidationPattern(email) || password.length < 6) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  next();
}

export default verifyUserCredentials;
