import { Router } from "express";
import categoryController from "../controllers/categoryController";
import { catchErrors } from "../middlewares/errrosHandlers/handlers";
import isAuth from "../middlewares/isAuth";

const categoryRouter = Router();

categoryRouter.get('/', isAuth, catchErrors(categoryController.index));
categoryRouter.get('/:id', isAuth, catchErrors(categoryController.show));
categoryRouter.post('/', isAuth, catchErrors(categoryController.store));
categoryRouter.patch('/:id', isAuth, catchErrors(categoryController.update));
categoryRouter.delete('/:id', isAuth, catchErrors(categoryController.destroy));


export default categoryRouter;