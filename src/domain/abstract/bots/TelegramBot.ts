import Logger from "../../../logger/Logger";

/**
 * Обший класс для телеграм-ботов в приложении
 */
export default abstract class TelegramBot {
    /**
     * Уникальный идентификатор бота, начинающийся с @
     * @protected
     */
    public readonly username: string;
    /**
     * Имя бота
     * @protected
     */
    public readonly name: string;
    /**
     * Описание бота
     * @protected
     */
    public readonly description: string;
    /**
     * Логгер для действий бота
     * @protected
     */
    protected readonly _logger: Logger;

    protected constructor(username: string, name: string, description: string, logger: Logger) {
        this.username = username;
        this.name = name;
        this.description = description;
        this._logger = logger;
    }

    /**
     * Инициализация и запуск бота
     */
    abstract start(): Promise<void>;

    /**
     * Остановка работы бота
     */
    abstract stop(): Promise<void>;

    /**
     * Отправка сообщения в телеграм-чат
     * @param chatId Уникальный идентификатор телеграм-чата
     * @param message Текстовое содержимое сообщения
     */
    abstract sendMessage(chatId: number, message: string): Promise<void>;
}
