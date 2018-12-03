// Libs
import { Request, Response } from 'express';
import { Services, helpers } from 'artoo';

// Models
import { User } from '../models/user';

export const login = (request: Request, response: Response): void => {
  Services.auth.attempt(request.body.email, request.body.password).then((result: { user: User, token: string }) => {
    response.json({
      token: result.token,
      user: result.user.serialize()
    })
  }).catch((error: any) => response.sendStatus(401));
}