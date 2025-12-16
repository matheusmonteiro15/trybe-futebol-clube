import { Router, Request, Response } from 'express';
import LeaderboradController from '../controllers/LeaderboardController';

const router = Router();
const leaderboardController = new LeaderboradController();

router.get(
  '/home',
  (req: Request, res: Response) => leaderboardController.fetchHomeLeaderboard(req, res),
);

export default router;
