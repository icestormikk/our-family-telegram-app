/**
 * Методы для получения данных из хранилища Redis
 */
export default interface RedisStreamConsumer {
    /**
     * Прочитать данные из нескольких потоков
     */
    consume(): Promise<any>
}