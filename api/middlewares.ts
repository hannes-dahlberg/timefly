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
    descriptor.value = function (...args: any[]) {
        if (!(middlewares instanceof Array)) { middlewares = [middlewares]; }
        return [...middlewares, originalMethod.apply(this, ...args)];
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
                const token = (request.headers.authorization as string).substr(8, request.headers.authorization.length);
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
                next();
            } catch (error) {
                response.status(400).json({ error: "Validation failed" });
            }
        };
    }
}
