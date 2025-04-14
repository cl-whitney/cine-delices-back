import { Router } from 'express';
import { signup } from '../controllers/authController.ts'

const authRouter = Router();

authRouter.post('/inscripiton', signup)

export default authRouter