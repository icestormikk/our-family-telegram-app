/**
 * Методы для подключения к хранилищу Redis
 */
export default interface RedisClient {
    /**
     * Подключение к хранилищу Redis
     */
    connectToRedis(): Promise<void>

    /**
     * Закрытие соединения с хранилищем
     */
    disconnectRedis(): Promise<void>
}