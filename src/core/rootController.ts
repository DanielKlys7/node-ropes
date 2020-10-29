import AuthController from 'modules/auth/controllers/AuthController';
import User from 'modules/auth/models/User';
import Secret from 'modules/auth/models/Secret';
import { mailService } from 'core/rootService';

export const authController = new AuthController(User, Secret, mailService);
