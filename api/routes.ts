// Libs
import * as Express from "express";

// Controllers
import { Controllers } from './controllers';
import * as middlewares from './middlewares';
import { Validation } from './modules/validation';

let routes: Express.Router = Express.Router();

routes.post('/auth/login', middlewares.guest, middlewares.validation({ email: Validation.email, password: Validation.required }), Controllers.Auth.login);

routes.post('/timer/start', middlewares.auth, Controllers.Timer.start);
routes.post('/timer/stop', middlewares.auth, Controllers.Timer.stop);

routes.get('/apa', (request: Express.Request, response: Express.Response) => {
  response.json({ foo: 'Hello world' });
})

export { routes };