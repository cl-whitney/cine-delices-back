import { Router } from "express";
import ingredientController from "../controllers/ingredientController";
import { catchErrors } from "../middlewares/errrosHandlers/handlers";
import isAdmin from "../middlewares/isAuth";
import isAuth from "../middlewares/isAuth";

const ingredientRouter = Router();

ingredientRouter.get('/', isAdmin, catchErrors(ingredientController.index));
ingredientRouter.get('/:id', isAdmin, isAuth, catchErrors(ingredientController.show));
ingredientRouter.post('/', isAdmin, isAuth, catchErrors(ingredientController.store));
ingredientRouter.patch('/:id', isAdmin, isAuth, catchErrors(ingredientController.update));
ingredientRouter.delete('/:id', isAdmin, isAuth, catchErrors(ingredientController.destroy));

export default ingredientRouter;