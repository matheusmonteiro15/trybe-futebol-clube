import TeamModel from '../database/models/SequelizeTeam';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import InterfaceLeaderboard from '../Interfaces/InterfaceLeaderboard';
import MatchService from './MatchService';
import LeaderboardCalcFunctions from '../utils/LeaderboardCalcFunctions';

export default class LeaderboardService {
  constructor(
    private teamModel = TeamModel,
    private matchService = new MatchService(),
  ) {}

  static sortTeams(teamOne: LeaderboardCalcFunctions, teamTwo: LeaderboardCalcFunctions) {
    switch (true) {
      case teamTwo.totalPoints !== teamOne.totalPoints:
        return teamTwo.totalPoints - teamOne.totalPoints;
      case teamTwo.totalVictories !== teamOne.totalVictories:
        return teamTwo.totalVictories - teamOne.totalVictories;
      case teamTwo.goalsBalance !== teamOne.goalsBalance:
        return teamTwo.goalsBalance - teamOne.goalsBalance;
      default:
        return teamTwo.goalsFavor - teamOne.goalsFavor;
    }
  }

  public async fetchHomeTeamLeaderboard(): Promise<ServiceResponse<InterfaceLeaderboard[]>> {
    const allTeams = await this.teamModel.findAll();
    const allFinishedMatchesResponse = await this.matchService.fetchAllMatchesByClubs(false);

    if (allFinishedMatchesResponse.status === 'SUCCESSFUL') {
      const allFinishedMatches = allFinishedMatchesResponse.data;
      const homeLeaderBoard = allTeams.map((team) =>
        new LeaderboardCalcFunctions(team, allFinishedMatches));
      const orderHomeLeaderBoard = homeLeaderBoard.sort((LeaderboardService.sortTeams));
      return { status: 'SUCCESSFUL', data: orderHomeLeaderBoard };
    }
    return {
      status: 'BAD_REQUEST',
      data: { message: 'Falha em exibir as partidas finalizadas' },
    };
  }
}
