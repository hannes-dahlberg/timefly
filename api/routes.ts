// Libs
import { Validation, container } from "artoo";
import * as Express from "express";

// Controllers
import { AuthController, TimerController } from './controllers';

import { Middlewares } from './middlewares';
const middlewares: Middlewares = container.getService(Middlewares);
const authController: AuthController = container.getService(AuthController);
const timerController: TimerController = container.getService(TimerController);

let routes: Express.Router = Express.Router();

routes.post('/auth/login', middlewares.guest(), middlewares.validation({ email: Validation.email, password: Validation.required }), authController.login());

routes.post('/timer/start', middlewares.auth(), timerController.start());
routes.post('/timer/stop', middlewares.auth(), timerController.stop());

routes.get('/test', (request: Express.Request, response: Express.Response) => {
  response.json({ foo: 'Hello world' });
})

export { routes };