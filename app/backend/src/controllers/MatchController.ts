import { Request, Response } from 'express';
import translateStatusToHTTPCode from '../utils/translateStatusToHTTPCode';
import MatchService from '../services/MatchService';

export default class MatchController {
  private matchService = new MatchService();

  public async fetchAllMatchesByClubs(req: Request, res: Response) {
    const { inProgress } = req.query;
    const response = await this.matchService
      .fetchAllMatchesByClubs(inProgress ? inProgress === 'true' : undefined);

    return res.status(translateStatusToHTTPCode(response.status))
      .json(response.data);
  }

  public async finalizedMatch(req: Request, res: Response) {
    const { id } = req.params;
    const response = await this.matchService.finalizedMatch(Number(id));

    return res.status(translateStatusToHTTPCode(response.status))
      .json(response.data);
  }

  public async updateMatchScore(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const response = await this.matchService
      .updateMatchScore(Number(id), Number(homeTeamGoals), Number(awayTeamGoals));

    return res.status(translateStatusToHTTPCode(response.status))
      .json(response.data);
  }

  public async createMatch(req: Request, res: Response) {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;
    const response = await this.matchService
      .createMatch({
        homeTeamId: Number(homeTeamId),
        awayTeamId: Number(awayTeamId),
        homeTeamGoals: Number(homeTeamGoals),
        awayTeamGoals: Number(awayTeamGoals),
      });

    return res.status(translateStatusToHTTPCode(response.status))
      .json(response.data);
  }
}
