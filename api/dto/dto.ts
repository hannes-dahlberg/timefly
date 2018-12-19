export class DTO {
  public fill(properties: { [key: string]: any }): DTO {
    Object.keys(properties).forEach((key: string) => {
      (this as any)[key] = properties[key];
    });

    return this;
  };
}