import { Router } from 'express';
import loginController from '../controllers/loginController';
import registerController from '../controllers/registerController';

const authRouter = Router();

authRouter.post('/inscription', registerController.signup);
authRouter.post('/connexion', loginController.login)
authRouter.delete('/logout', loginController.logout)
// authRouter.post('/admin/connexion', )

// biome-ignore lint/suspicious/noConsole: <explanation>
console.log(registerController);
// biome-ignore lint/suspicious/noConsole: <explanation>
console.log(loginController.logout)

export default authRouter