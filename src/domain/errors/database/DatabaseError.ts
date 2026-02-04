/**
 * Исключение, возникшее во время взаимодействия с базой даннных
 */
export default class DatabaseError extends Error {
    /**
     * Создание нового исключения, возникшего во время работы с базой данных
     * @param message Причина исключения
     */
    public constructor(message: string) {
        super(message);
    }
}