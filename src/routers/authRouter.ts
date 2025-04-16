import { Router } from 'express';
import registerController from '../controllers/registerController';

const authRouter = Router();

authRouter.post('/inscription', registerController.signup);

// biome-ignore lint/suspicious/noConsole: <explanation>
console.log(registerController)

export default authRouter