// Obtain the parameters of a function type in a tuple
export type ParametersType<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;
// Obtain the parameters of a constructor function type in a tuple
export type ConstructorParametersType<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any ? P : never;
// Obtain the return type of a function type
export type ReturnTypeType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;
// Obtain the return type of a constructor function type
export type InstanceTypeType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R ? R : any;

export const apiPath: string = `http://${process.env.API_HOST}:${process.env.PORT}`;