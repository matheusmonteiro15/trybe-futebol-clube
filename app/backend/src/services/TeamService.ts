import { ServiceResponse } from '../Interfaces/ServiceResponse';
import InterfaceTeam from '../Interfaces/InterfaceTeam';
import TeamModel from '../database/models/SequelizeTeam';

export default class TeamService {
  private teamModel = TeamModel;

  public async fetchAllFootballClubs(): Promise<ServiceResponse<InterfaceTeam[]>> {
    try {
      const allTeams = await this.teamModel.findAll();
      return {
        status: 'SUCCESSFUL',
        data: allTeams,
      };
    } catch (error) {
      const erro = error as Error;
      console.error(erro.message);
      return {
        status: 'INTERNAL_ERROR',
        data: { message: 'Internal server error' } };
    }
  }

  public async fetchFootballClubById(id: number) {
    try {
      const teamId = await this.teamModel.findByPk(id);
      if (!teamId) {
        return {
          status: 'NOT_FOUND',
          data: { message: `Team ${id} not found` } };
      }
      return {
        status: 'SUCCESSFUL',
        data: teamId,
      };
    } catch (error) {
      const erro = error as Error;
      console.error(erro.message);
      return {
        status: 'INTERNAL_ERROR',
        data: { message: 'Internal server error' } };
    }
  }
}
