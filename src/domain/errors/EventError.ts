/**
 * Ошибка, возникшая в результате работы/вызова события
 */
export default class EventError extends Error {
    /**
     * Конструктор для создания новой ошибки, связанной с событиями
     * @param message Причина ошибки
     */
    public constructor(message: string) {
        super(message);
    }
}