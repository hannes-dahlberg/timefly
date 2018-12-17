// Libs
import { AuthService, container } from "artoo";
import { Request, RequestHandler, Response } from "express";
import { Middlewares, middleware } from "../middlewares";
import { Validation } from "../modules/validation";

const middlewares: Middlewares = container.getService(Middlewares);

// Models
import { UserModel } from "../models/user.model";
container.getService(AuthService);

export class AuthController {
  constructor(
    private readonly authService: AuthService = container.getService(AuthService),
  ) { }

  @middleware(middlewares.validation({ email: [Validation.required, Validation.email], password: Validation.required }))
  public login(): RequestHandler {
    return (request: Request, response: Response): void => {
      this.authService.attempt(request.body.email, request.body.password).then((result: { user: UserModel, token: string }) => {
        response.json({
          token: result.token,
          user: result.user.serialize(),
        });
      }).catch((error: any) => response.sendStatus(401));
    };
  }
}
