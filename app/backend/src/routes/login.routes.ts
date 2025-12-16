import { Request, Response, Router } from 'express';
import UserController from '../controllers/UserController';
import verifyUserCredentials from '../middlewares/verifyUserCredentials';
import validateToken from '../middlewares/validateToken';

const userController = new UserController();

const router = Router();

router.post(
  '/',
  verifyUserCredentials,
  (req: Request, res: Response) => userController.login(req, res),
);
router.get(
  '/role',
  validateToken,
  (req: Request, res: Response) => userController.getRole(req, res),
);

export default router;
