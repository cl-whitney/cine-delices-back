import { Router } from "express";
import categoryController from "../controllers/categoryController";
import { catchErrors } from "../middlewares/errrosHandlers/handlers";
import isAuth from "../middlewares/isAuth";

const categoryRouter = Router();

categoryRouter.get('/', catchErrors(categoryController.index));
categoryRouter.get('/:slug', catchErrors(categoryController.show));
categoryRouter.post('/:slug', isAuth, catchErrors(categoryController.store));
categoryRouter.patch('/:slug', isAuth, catchErrors(categoryController.update));
categoryRouter.delete('/:slug', isAuth, catchErrors(categoryController.destroy));


export default categoryRouter;