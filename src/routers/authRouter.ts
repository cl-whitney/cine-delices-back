import { Router } from 'express';
import loginController from '../controllers/loginController';
import registerController from '../controllers/registerController';

const authRouter = Router();

authRouter.post('/inscription', registerController.signup);
authRouter.post('/connexion', loginController.login)
authRouter.delete('/deconnexion', loginController.logout)

export default authRouter