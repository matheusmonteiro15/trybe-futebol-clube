import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';

type InterfacePayload = {
  id: number;
  username: string;
  role: string;
  email: string;
};

export default class TokenManager {
  private static secret: string = process.env.JWT_SECRET || 'null';
  private static options: SignOptions = {
    expiresIn: '1d',
    algorithm: 'HS256',
  };

  public static generateToken(payload: InterfacePayload): string {
    return jwt.sign(payload, TokenManager.secret, TokenManager.options);
  }

  public static validateAuthToken(token: string): InterfacePayload | null {
    try {
      const decoded = jwt.verify(token, TokenManager.secret) as InterfacePayload;
      return decoded;
    } catch (error) {
      const { message } = error as Error;
      console.error(message);
      return null;
    }
  }
}
