import { NextFunction, Request, Response } from 'express';
import TokenManager from '../credentialsAcessControl/tokenManager';

async function validateToken(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token not found' });
  }
  const token = authorization.split(' ')[1];
  const tokenDecoded = TokenManager.validateAuthToken(token);
  if (!tokenDecoded) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
  req.body.user = { ...tokenDecoded };

  next();
}

export default validateToken;
