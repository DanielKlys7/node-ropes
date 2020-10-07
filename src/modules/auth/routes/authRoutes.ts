import { Router } from 'express';

import authControllers from '../controllers/authController';

const authRouter = Router();

authRouter.post('/signup', authControllers.signupPost);
authRouter.post('/login', authControllers.loginPost);

export default authRouter;
