export class ApplicationError extends Error {
  constructor(message: string, public code: string, public status: number = 500) {
    super(message);
  }
}

export class EntityNotFoundError extends ApplicationError {
  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} not found`, "ENTITY_NOT_FOUND", 404);
  }
}
