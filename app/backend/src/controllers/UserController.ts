import { Request, Response } from 'express';
import UserService from '../services/UserService';
import translateStatusToHTTPCode from '../utils/translateStatusToHTTPCode';

export default class UserController {
  private userService = new UserService();

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const response = await this.userService.login(email, password);

    return res.status(translateStatusToHTTPCode(response.status))
      .json(response.data);
  }

  public async getRole(req: Request, res: Response) {
    const { id } = req.body.user;
    const response = await this.userService.getRole(id);

    return res.status(translateStatusToHTTPCode(response.status))
      .json(response.data);
  }
}
