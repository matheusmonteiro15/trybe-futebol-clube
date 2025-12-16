import { Request, Response } from 'express';
import TeamService from '../services/TeamService';
import translateStatusToHTTPCode from '../utils/translateStatusToHTTPCode';

export default class TeamController {
  constructor(
    private teamService = new TeamService(),
  ) { }

  public async fetchAllFootballClubs(_req: Request, res: Response) {
    const response = await this.teamService.fetchAllFootballClubs();
    res.status(translateStatusToHTTPCode(response.status))
      .json(response.data);
  }

  public async fetchFootballClubById(req: Request, res: Response) {
    const { id } = req.params;
    const response = await this.teamService.fetchFootballClubById(Number(id));
    res.status(translateStatusToHTTPCode(response.status))
      .json(response.data);
  }
}
