import { Router } from "express";
import recipeController from "../controllers/recipeController";
import { catchErrors } from "../middlewares/errrosHandlers/handlers";
import isAuth from "../middlewares/isAuth";

const recipeRouter = Router ()

recipeRouter.get('/', catchErrors(recipeController.index))
recipeRouter.get('/:id', catchErrors(recipeController.show))
recipeRouter.post('/', isAuth, catchErrors(recipeController.store))
recipeRouter.patch('/:id', isAuth, catchErrors(recipeController.update))
recipeRouter.delete('/', isAuth, catchErrors(recipeController.destroy))

export default recipeRouter