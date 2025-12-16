import { Request, Response, Router } from 'express';
import MatchController from '../controllers/MatchController';
import validateToken from '../middlewares/validateToken';

const matchesController = new MatchController();

const router = Router();

router.get('/', (req: Request, res: Response) => matchesController
  .fetchAllMatchesByClubs(req, res));

router.patch(
  '/:id/finish',
  validateToken,
  (req: Request, res: Response) => matchesController.finalizedMatch(req, res),
);

router.patch(
  '/:id',
  validateToken,
  (req: Request, res: Response) => matchesController.updateMatchScore(req, res),
);

router.post(
  '/',
  validateToken,
  (req: Request, res: Response) => matchesController.createMatch(req, res),
);

export default router;
