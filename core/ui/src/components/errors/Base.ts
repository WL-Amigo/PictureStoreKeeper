export class BaseError extends Error {
  public constructor(e?: string) {
    super(e);
    this.name = new.target.name;
  }
}

export class FatalError extends Error {
  public constructor(reason: string) {
    super(reason);
  }
}