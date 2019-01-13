import { container, HelperService } from "artoo";
import { NextFunction, Request, RequestHandler, Response } from "express";

const helperService: HelperService = container.getService(HelperService, { useName: "service.helpers" });

export type formWorker = (value: string) => any;

export const FormWorker = {
  parseNumber: (decimals: number = 2, symbol: string | RegExp = "."): formWorker => (value: string): number | null => {
    if (!(symbol instanceof RegExp)) {
      symbol = new RegExp(`\\${symbol}`, "ig");
    }

    const returnValue: number = parseFloat(value.toString().replace(symbol, "."));
    // Check for NaN
    if (returnValue === returnValue) {
      const pow = Math.pow(10, decimals);
      return Math.round(returnValue * pow) / pow;
    }

    return null;
  },
  parseInteger: (value: string): number | null => {
    const returnValue: number = parseInt(value);
    return returnValue === returnValue ? returnValue : null;
  },
  parseDate: (value: string): Date | null => {
    const returnValue = new Date(value);
    return returnValue.toString() !== "Invalid Date" ? returnValue : null;
  },
  parseModel: <T, C extends new (...args: any[]) => T>(model: C): formWorker => (value: string): T => {
    return new (model)(value);
  },
};

export interface IFormWorkerInput { [key: string]: IFormWorkerInput | formWorker | formWorker[]; }

export const workForm = (formWorker: IFormWorkerInput) => (target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    return [(request: Request, response: Response, next: NextFunction): void => {
      const workit = (formWorker: IFormWorkerInput, key: string = "") => {
        Object.keys(formWorker).forEach((name: string) => {
          key = key.length > 0 ? `.${name}` : name;
          let tempFormWorker = formWorker[name];
          if (!(tempFormWorker instanceof Array) && typeof tempFormWorker !== "function") {
            workit(tempFormWorker, name);
          } else {
            if (!(tempFormWorker instanceof Array)) { tempFormWorker = [tempFormWorker]; }
            tempFormWorker.forEach((formWorker: formWorker) => {
              helperService.dotAnnotaion(request, (request.method === "GET" ? "query" : "body") + "." + key, formWorker);
            });
          }
        });
      };
      workit(formWorker);
      next();
    }, originalMethod.apply(this, ...args)];
  };
};
