// Libs
import { container, Validation } from "artos";
import { Request, RequestHandler, Response, Router } from "express";

// Controllers
import { AuthController, ReportController, TimerController } from "./controllers";

import { ClientController } from "./controllers/client.controller";
import { Middlewares } from "./middlewares";
const middlewares: Middlewares = container.getService(Middlewares);
const authController: AuthController = container.getService(AuthController);
const timerController: TimerController = container.getService(TimerController);
const reportController: ReportController = container.getService(ReportController);
const clientController: ClientController = container.getService(ClientController);

const router: Router = Router();

/*const group = (router: Router, path: string, middlewares: RequestHandler, callback: (router: Router) => void) => {
  router.use(path, middlewares);
  callback(router);
};*/

router.post("/auth/login", middlewares.guest(), authController.login());

router.get("/report", middlewares.auth(), reportController.index());
router.post("/timer/start", middlewares.auth(), timerController.start());
router.put("/timer/stop", middlewares.auth(), timerController.stop());
router.get("/client", middlewares.auth(), clientController.index());

router.get("/test", (request: Request, response: Response) => {
  response.json({ foo: "Hello world" });
});

/*group(router, "timer", middlewares.auth(), (router: Router) => {
  router.get("", timerController.index());
  router.post("start", timerController.start());
  router.post("stop", timerController.stop());
});*/

export { router };
