/**
 * Методы для записи данных в потоки (Streams) хранилища Redis
 */
export default interface RedisPublisher {
    /**
     * Добавление сообшение в поток в хранилище Redis
     * @param stream Уникальный идентификатор потока в Redis
     * @param data Данные, которые необходимо записать в сообщение
     */
    publish(stream: string, data: object): Promise<string>;
}