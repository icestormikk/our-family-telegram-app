import Logger from "../../../logger/Logger";

/**
 * Обший класс для телеграм-ботов в приложении
 */
export default abstract class TelegramBot {
    /**
     * Уникальный идентификатор бота, начинающийся с @
     * @protected
     */
    protected readonly _username: string;
    /**
     * Имя бота
     */
    protected readonly _name: string;
    /**
     * Описание бота
     */
    protected readonly _description: string;
    /**
     * Логгер для действий бота
     * @private
     */
    protected readonly _logger: Logger;

    protected constructor(username: string, name: string, description: string, logger: Logger) {
        this._username = username;
        this._name = name;
        this._description = description;
        this._logger = logger;
    }

    /**
     * Инициализация и запуск бота
     */
    abstract start(): Promise<void>
}
