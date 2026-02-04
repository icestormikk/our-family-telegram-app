import DatabaseError from "./DatabaseError";

/**
 * Исключение, обозначающее отсутствие объекта, подходщяего под параметры запроса
 */
export default class EntityNotFoundError extends DatabaseError {
    public constructor(message: string) {
        super(message);
    }
}