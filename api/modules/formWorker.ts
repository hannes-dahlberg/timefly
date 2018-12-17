import { NextFunction, Request, RequestHandler, Response } from "express";
import { HelperService, container } from "Artoo";

const helperService: HelperService = container.getService(HelperService, { useName: 'service.helpers'});

export type formWorker = (value: string) => any;

export const formWorker = {
  decimal: (decimals: number = 2, symbol: string | RegExp = '.'): formWorker => (value: string): number => {
    console.log('VALUE', value)
    if(!(symbol instanceof RegExp)) {
      symbol = new RegExp(symbol, 'ig');
    }
    const pow = Math.pow(10, decimals);
    let returnValue: number = parseFloat(value.replace(symbol, "."));
    return Math.round(returnValue * pow) / pow;
  }
}

export interface IFormWorkerInput { [key: string]: IFormWorkerInput | formWorker | formWorker[] }


export const workForm = (formWorker: IFormWorkerInput) => (target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    return [(request: Request, response: Response, next: NextFunction): void => {
      const workit = (formWorker: IFormWorkerInput, key: string = "") => {
        Object.keys(formWorker).forEach((name: string) => {
          key = key.length > 0 ? `.${name}` : name;
          let tempFormWorker = formWorker[name];
          if (!(tempFormWorker instanceof Array) && typeof tempFormWorker !== 'function') {
            workit(tempFormWorker, name);
          } else {
            if (!(tempFormWorker instanceof Array)) { tempFormWorker = [tempFormWorker]; }
            tempFormWorker.forEach((formWorker: formWorker) => {
              var a = (originalValue: any) => formWorker('22');
              helperService.dotAnnotaion(request, (request.method === 'GET' ? 'query' : 'body') + "." + key, a);
            });
          }
        });
      }
      workit(formWorker);
      next();
    }, originalMethod.apply(this, ...args)];
  };
}