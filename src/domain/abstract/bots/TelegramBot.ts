/**
 * Обший класс для телеграм-ботов в приложении
 */
export default abstract class TelegramBot {
    /**
     * Имя бота
     */
    private readonly _name: string;
    /**
     * Описание бота
     */
    private readonly _description: string;

    protected constructor(name: string, description: string) {
        this._name = name;
        this._description = description;
    }

    /**
     * Инициализация и запуск бота
     */
    abstract start(): Promise<void>

    public getName(): string {
        return this._name;
    }

    public getDescription(): string {
        return this._description;
    }
}
