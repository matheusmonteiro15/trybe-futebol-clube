import { Response, Request } from 'express';
import translateStatusToHTTPCode from '../utils/translateStatusToHTTPCode';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(
    private leaderboardService = new LeaderboardService(),
  ) {}

  public async fetchHomeLeaderboard(_req: Request, res: Response) {
    const response = await this.leaderboardService.fetchHomeTeamLeaderboard();
    return res.status(translateStatusToHTTPCode(response.status)).json(response.data);
  }
}
