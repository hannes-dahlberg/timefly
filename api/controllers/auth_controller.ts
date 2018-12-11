// Libs
import { Request, Response, RequestHandler } from "express";
import { AuthService, container } from 'artoo';

// Models
import { UserModel } from '../models/user_model';
container.getService(AuthService)
export class AuthController {
  constructor(
    private readonly authService: AuthService = container.getService(AuthService)
  ) { }

  public login(): RequestHandler {
    return (request: Request, response: Response): void => {
      this.authService.attempt(request.body.email, request.body.password).then((result: { user: UserModel, token: string }) => {
        response.json({
          token: result.token,
          user: result.user.serialize()
        })
      }).catch((error: any) => response.sendStatus(401));
    }
  }
}