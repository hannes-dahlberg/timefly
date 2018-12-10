// Libs
import { Request, Response, NextFunction, RequestHandler } from 'express';

import { validationInput, validate } from './modules/validation';

// Models
import { AuthService, container, UserModel } from 'artoo';

// Add User to express request interface
declare global {
    namespace Express {
        interface Request {
            user: UserModel
        }
    }
}

const userModel: typeof UserModel = container.get<typeof UserModel>(UserModel);

export class Middlewares {
    constructor(
        private readonly authService: AuthService = container.getService(AuthService),
        private readonly userModel: typeof UserModel = container.get<typeof UserModel>(UserModel)
    ) { }

    public auth(): RequestHandler {
        return (request: Request, response: Response, next: NextFunction): void => {
            //Check for authorization header
            if (request.headers.authorization) {
                //Extract token from header
                let token = (request.headers.authorization as string).substr(7, request.headers.authorization.length);
                //Decode token
                this.authService.check(token).then((user: UserModel) => {
                    request.user = user;
                    next();
                }).catch((error: any) => response.sendStatus(401));
            } else {
                response.sendStatus(400);
            }
        }
    }

    public guest(): RequestHandler {
        return (request: Request, response: Response, next: NextFunction): void => {
            if (!request.headers.authorization) {
                next();
            } else {
                response.sendStatus(400);
            }
        }
    }

    public validation(validation: validationInput): RequestHandler {
        return (request: Request, response: Response, next: NextFunction): void => {
            //Check if request body is empty
            if (validate(request.body, validation)) {
                next();
            } else {
                response.status(400).send('Validation failed');
            }
        }
    }
}