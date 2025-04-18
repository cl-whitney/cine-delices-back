import { Router } from "express";
import mediaController from "../controllers/mediaController";
import { catchErrors } from "../middlewares/errrosHandlers/handlers";
import isAuth from "../middlewares/isAuth";

const mediaRouter = Router();

mediaRouter.get('/', isAuth, catchErrors(mediaController.index));
mediaRouter.get('/:id', isAuth, catchErrors(mediaController.show));
mediaRouter.post('/', isAuth, catchErrors(mediaController.store));
mediaRouter.patch('/:id', isAuth, catchErrors(mediaController.update));
mediaRouter.delete('/:id', isAuth, catchErrors(mediaController.destroy));


export default mediaRouter;
