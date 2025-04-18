import { Router } from "express";
import categoryController from "../controllers/categoryController";
import { catchErrors } from "../middlewares/errrosHandlers/handlers";
import isAdmin from "../middlewares/isAdmin";
import isAuth from "../middlewares/isAuth";

const categoryRouter = Router();

categoryRouter.get('/', isAuth, catchErrors(categoryController.index));
categoryRouter.get('/:id', isAuth, catchErrors(categoryController.show));
categoryRouter.post('/', isAdmin, catchErrors(categoryController.store));
categoryRouter.patch('/:id', isAdmin, catchErrors(categoryController.update));
categoryRouter.delete('/:id', isAdmin, catchErrors(categoryController.destroy));


export default categoryRouter;