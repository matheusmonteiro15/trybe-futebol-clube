import * as bcrypt from 'bcryptjs';
import TokenManager from '../credentialsAcessControl/tokenManager';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import UserModel from '../database/models/SequelizeUser';

export default class UserService {
  private userModel = UserModel;

  public async login(email: string, password: string): Promise<ServiceResponse<{ token: string }>> {
    const dataUser = await this.userModel.findOne({ where: { email } });
    if (!dataUser) {
      return {
        status: 'UNAUTHORIZED',
        data: { message: 'Invalid email or password' } };
    }

    const {
      password: dbPassword,
      id,
      username,
      role,
    } = dataUser.toJSON();

    const isPasswordValid = bcrypt.compareSync(password, dbPassword);
    if (!isPasswordValid) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }

    const token = TokenManager.generateToken({ id, username, role, email });

    return { status: 'SUCCESSFUL', data: { token } };
  }

  public async getRole(id: number): Promise<ServiceResponse<{ role: string }>> {
    try {
      const user = await this.userModel.findByPk(id);
      if (!user) {
        return {
          status: 'NOT_FOUND',
          data: { message: 'User not found' } };
      }
      const { role } = user.toJSON();
      return {
        status: 'SUCCESSFUL',
        data: { role } };
    } catch (error) {
      const { message } = error as Error;
      console.error(message);
      return {
        status: 'INTERNAL_ERROR',
        data: { message: 'Internal server error' } };
    }
  }
}
