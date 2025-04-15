import { Router } from 'express';
import registerController from '../controllers/registerController';

const authRouter = Router();

authRouter.post('/inscription', registerController.signup);

export default authRouter