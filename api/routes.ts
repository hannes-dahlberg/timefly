// Libs
import { container, Validation } from "artoo";
import { Request, RequestHandler, Response, Router } from "express";

// Controllers
import { AuthController, TimerController } from "./controllers";

import { Middlewares } from "./middlewares";
const middlewares: Middlewares = container.getService(Middlewares);
const authController: AuthController = container.getService(AuthController);
const timerController: TimerController = container.getService(TimerController);

const router: Router = Router();

/*const group = (router: Router, path: string, middlewares: RequestHandler, callback: (router: Router) => void) => {
  router.use(path, middlewares);
  callback(router);
};*/

router.post("/auth/login", middlewares.guest(), middlewares.validation({ email: Validation.email, password: Validation.required }), authController.login());

router.get("/timer", middlewares.auth(), timerController.index());
router.post("/timer/start", middlewares.auth(), timerController.start());
router.post("/timer/stop", middlewares.auth(), timerController.stop());

router.get("/test", (request: Request, response: Response) => {
  response.json({ foo: "Hello world" });
});

/*group(router, "timer", middlewares.auth(), (router: Router) => {
  router.get("", timerController.index());
  router.post("start", timerController.start());
  router.post("stop", timerController.stop());
});*/

export { router };
