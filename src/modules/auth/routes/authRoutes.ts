import { Router } from 'express';

import authControllers from '../controllers/authController';

const authRouter = Router();

authRouter.post('/signup', authControllers.signupPost);
authRouter.post('/login', authControllers.loginPost);
authRouter.post('/emailConfirm', authControllers.emailConfirmPost);
authRouter.post('/emailConfirmRequest', authControllers.emailConfirmRequestPost);

export default authRouter;
