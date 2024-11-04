export class ApplicationError extends Error {
  constructor(message: string, public code: string, public status: number = 500) {
    super(message);
  }
}

export class EntityNotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} not found`);
    this.name = "EntityNotFoundError";
  }
}

export class AdminAccessRequiredError extends Error {
  constructor() {
    super("Admin access required");
    this.name = "AdminAccessRequiredError";
  }
}
