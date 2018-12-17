import { container, HelperService } from "artoo";
import * as moment from "moment";

export type validation = (value: string) => boolean;
const helperService: HelperService = container.getService(HelperService);

export const Validation = {
  date: (format: string | null = null): validation => (value: string): boolean => {
    return moment(value, format).isValid();
  },
  email: (value: string): boolean => {
    return (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
  },
  max: (max: number): validation => (value: string): boolean => {
    if (Number(value)) { return Number(value) <= max; }
    return value.length <= max;
  },
  min: (min: number): validation => (value: string): boolean => {
    if (Number(value)) { return Number(value) >= min; }
    return value.length >= min;
  },
  required: (value: string): boolean => {
    return value.length > 0;
  },
  number: (value: string): boolean => {
    return helperService.isDecimal(value);
  }
};

export interface IValidationValue { [key: string]: IValidationValue | string; }
export interface IValidationInput { [key: string]: IValidationInput | validation | validation[]; }

export const validate = (value: IValidationValue | string, validation: IValidationInput | validation | validation[]): boolean => {
  if (typeof value !== "string" && !(validation instanceof Array) && typeof validation !== "function") {
    return Object.keys(value).findIndex((valueName: string) => {
      return validation[valueName] !== undefined ? !validate(value[valueName], validation[valueName]) : false;
    }) === -1 ? true : false;
  } else if (typeof value === "string" && validation instanceof Array) {
    return validation.findIndex((validation: validation) => !validate(value, validation)) === -1 ? true : false;
  } else if (typeof value === "string" && typeof validation === "function") {
    return validation(value);
  }

  throw new Error("Validation failed. Input missmatched");
};
