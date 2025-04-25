import { Router } from "express";
import userController from "../controllers/userController";
import { catchErrors } from "../middlewares/errrosHandlers/handlers";
import isAuth from "../middlewares/isAuth";

const UsersRouter = Router ()

UsersRouter.get('/users', catchErrors(userController.index))
UsersRouter.get('/users/:id', isAuth, catchErrors(userController.show))
UsersRouter.patch('/users/:id', isAuth, catchErrors(userController.update))
UsersRouter.delete('/users', isAuth, catchErrors(userController.destroy))

export default UsersRouter