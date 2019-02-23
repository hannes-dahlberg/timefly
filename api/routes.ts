// Libs
import { container } from "artos";
import { Request, Response, Router } from "express";

// Controllers
import { AuthController, ClientController, ReportController, TimerController } from "./controllers";

// Middlewares
import { Middlewares } from "./middlewares";

const middlewares: Middlewares = container.getService(Middlewares);
const authController: AuthController = container.getService(AuthController);
const timerController: TimerController = container.getService(TimerController);
const reportController: ReportController = container.getService(ReportController);
const clientController: ClientController = container.getService(ClientController);

const router: Router = Router();

router.post("/auth/login", middlewares.guest(), authController.login());
router.get("/report", middlewares.auth(), reportController.index());
router.post("/report", middlewares.auth(), reportController.create());
router.put("/report/:id", middlewares.auth(), reportController.update());
router.delete("/report/:id", middlewares.auth(), reportController.remove());
router.post("/timer/start", middlewares.auth(), timerController.start());
router.put("/timer/:id/stop", middlewares.auth(), timerController.stop());
router.get("/client", middlewares.auth(), clientController.index());

export { router };
