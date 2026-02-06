/**
 * Методы для получения данных из хранилища Redis
 */
export default interface RedisConsumer {
    /**
     * Прочитать данные из нескольких потоков
     */
    read(): Promise<any>
}