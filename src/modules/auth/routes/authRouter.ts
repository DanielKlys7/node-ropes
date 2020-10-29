import { Router } from 'express';

import { authController } from 'core/rootController';

const authRouter = Router();

authRouter.post('/signup', authController.signupPost);
authRouter.post('/login', authController.loginPost);
authRouter.post('/emailConfirm', authController.emailConfirmPost);
authRouter.post('/emailConfirmRequest', authController.emailConfirmRequestPost);

export default authRouter;
