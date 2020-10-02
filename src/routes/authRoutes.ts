import { Router } from 'express';

import authControllers from '../controllers/authController';

export const authRouter = Router();

authRouter.get('/auth', authControllers.auth_signup);
