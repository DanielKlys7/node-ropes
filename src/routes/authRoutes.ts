import { Router } from 'express';

import authControllers from '../controllers/authController';

const authRouter = Router();

authRouter.post('/', authControllers.signupPost);

export default authRouter;
