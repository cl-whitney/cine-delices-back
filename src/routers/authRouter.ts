import { Router } from 'express';
import loginController from '../controllers/loginController';
import registerController from '../controllers/registerController';
import isAuth from '../middlewares/isAuth';

const authRouter = Router();

authRouter.post('/inscription', registerController.signup);
authRouter.post('/connexion', loginController.login)
authRouter.delete('/deconnexion', isAuth, loginController.logout)

export default authRouter