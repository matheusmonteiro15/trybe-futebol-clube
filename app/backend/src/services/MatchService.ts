import MatchModel from '../database/models/SequelizeMatch';
import TeamModel from '../database/models/SequelizeTeam';
import InterfaceMatch from '../Interfaces/InterfaceMatch';
import { ServiceResponse, ServiceResponseMessage } from '../Interfaces/ServiceResponse';

type reqBodyMatch = {
  homeTeamId: number;
  awayTeamId: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
};

export default class MatchService {
  private matchModel = MatchModel;
  private teamModel = TeamModel;
  private includeInResponse = [
    { association: 'homeTeam', attributes: ['teamName'] },
    { association: 'awayTeam', attributes: ['teamName'] }];

  private internalError = 'Internal server error';

  public async fetchAllMatchesByClubs(
    inProgress?: boolean,
  ): Promise<ServiceResponse<InterfaceMatch[]>> {
    try {
      if (inProgress === undefined) {
        const allMatches = await this.matchModel.findAll({
          include: this.includeInResponse });
        return { status: 'SUCCESSFUL', data: allMatches.map((match) => match.dataValues) };
      }
      const fetchMatchesByProg = await this.matchModel.findAll({
        where: { inProgress },
        include: this.includeInResponse,
      });
      return { status: 'SUCCESSFUL', data: fetchMatchesByProg.map((match) => match.dataValues) };
    } catch (error) {
      console.error(error);
      return { status: 'INTERNAL_ERROR', data: { message: this.internalError } };
    }
  }

  public async finalizedMatch(id: number): Promise<ServiceResponse<ServiceResponseMessage>> {
    try {
      const match = await this.matchModel.findByPk(id);
      if (!match) {
        return { status: 'NOT_FOUND', data: { message: 'Match not found' } };
      }
      await match.update({ inProgress: false });
      return {
        status: 'SUCCESSFUL',
        data: { message: 'Finished' },
      };
    } catch (error) {
      const { message } = error as Error;
      console.error(message);
      return {
        status: 'INTERNAL_ERROR',
        data: { message: this.internalError } };
    }
  }

  public async updateMatchScore(matchId: number, homeTeamGoals: number, awayTeamGoals: number)
    : Promise<ServiceResponse<ServiceResponseMessage>> {
    try {
      const match = await this.matchModel.findByPk(matchId);
      if (!match) return { status: 'NOT_FOUND', data: { message: 'Match not found' } };
      await this.matchModel.update(
        { homeTeamGoals, awayTeamGoals },
        { where: { id: matchId } },
      );
      return {
        status: 'SUCCESSFUL',
        data: { message: 'Changed' },
      };
    } catch (error) {
      const { message } = error as Error;
      console.error(message);
      return { status: 'INTERNAL_ERROR', data: { message: this.internalError } };
    }
  }

  public async createMatch(reqBodyMatch: reqBodyMatch): Promise<ServiceResponse<InterfaceMatch>> {
    try {
      if (reqBodyMatch.homeTeamId === reqBodyMatch.awayTeamId) {
        return { status: 'UNPROCESSABLE',
          data: { message: 'It is not possible to create a match with two equal teams' } };
      }
      const doTeamsExist = await this
        .doTeamsExist(reqBodyMatch.homeTeamId, reqBodyMatch.awayTeamId);
      if (!doTeamsExist) {
        return { status: 'NOT_FOUND', data: { message: 'There is no team with such id!' } };
      }
      const newMatch = await this.matchModel.create({ ...reqBodyMatch, inProgress: true });
      return { status: 'CREATED', data: newMatch };
    } catch (error) {
      const { message } = error as Error;
      console.error(message);
      return { status: 'INTERNAL_ERROR', data: { message: this.internalError } };
    }
  }

  private async doTeamsExist(homeTeamId: number, awayTeamId: number): Promise<boolean> {
    const checkTeams = await Promise.all([
      this.teamModel.findByPk(homeTeamId), // findByPk retorna null se o id não for encontrado
      this.teamModel.findByPk(awayTeamId),
    ]);
    return !checkTeams.includes(null);
  }
}
