// Libs
import { NextFunction, Request, RequestHandler, Response } from "express";

import { UserModel } from "./models/user_model";
import { IValidationInput, validate } from "./modules/validation";

// Models
import { AuthService, container } from "artoo";

// Add User to express request interface
declare global {
    namespace Express {
        interface Request {
            user: UserModel;
        }
    }
}

export const middleware = (middlewares: RequestHandler | RequestHandler[]) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = (...args: any[]) => {
        return (request: Request, response: Response, next: NextFunction): void => {
            if (!(middlewares instanceof Array)) { middlewares = [middlewares]; }

            const itterateMiddlewares: (request: Request, response: Response, middlewares: RequestHandler[]) => void = (request: Request, response: Response, middlewares: RequestHandler[]): void => {
                if (middlewares.length > 1) {
                    middlewares[0](request, response, () => itterateMiddlewares(request, response, middlewares.slice(1, middlewares.length));
                } else {
                    middlewares[0](request, response, () => originalMethod(...args)(request, response, [next()]));
                }
            };
            itterateMiddlewares(request, response, middlewares);
        };
    };
};

container.set<typeof UserModel>("model.user", UserModel);

export class Middlewares {
    constructor(
        private readonly authService: AuthService = container.getService(AuthService),
        private readonly userModel: typeof UserModel = container.get<typeof UserModel>("model.user", UserModel),
    ) { }

    public auth(): RequestHandler {
        return (request: Request, response: Response, next: NextFunction): void => {
            // Check for authorization header
            if (request.headers.authorization) {
                // Extract token from header
                const token = (request.headers.authorization as string).substr(7, request.headers.authorization.length);
                // Decode token
                this.authService.check(token).then((user: UserModel) => {
                    request.user = user;
                    next();
                }).catch((error: any) => response.sendStatus(401));
            } else {
                response.sendStatus(400);
            }
        };
    }

    public guest(): RequestHandler {
        return (request: Request, response: Response, next: NextFunction): void => {
            if (!request.headers.authorization) {
                next();
            } else {
                response.sendStatus(400);
            }
        };
    }

    public validation(validation: IValidationInput): RequestHandler {
        return (request: Request, response: Response, next: NextFunction): void => {
            // Check if request body is empty
            try {
                validate(request.method === "GET" ? request.query : request.body, validation);
            } catch (error) {
                response.status(400).json({ error: "Validation failed" });
            }
            next();
        };
    }
}
