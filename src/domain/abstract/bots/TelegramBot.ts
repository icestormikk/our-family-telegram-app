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
     * @param replyToId Сообщение на которое отправляется ответ
     * @return Идентификатор отправленного сообщения
     */
    abstract sendMessage(chatId: number, message: string, replyToId?: number): Promise<number>;

    /**
     * Отправка сообщения с анимацией (и возможным текстом к ней) в телеграм-чат
     * @param chatId Уникальный идентификатор чата
     * @param animationFilepath Путь к файлу с анимацией
     * @param caption Подпись к сообщению
     */
    abstract sendWithAnimation(chatId: number, animationFilepath: string, caption?: string): Promise<number>;

    /**
     * Установка статуса действия для телеграм-бота в чате (максимум на 5 секунд)
     * @param chatId
     * @param action
     */
    abstract sendChatAction(chatId: number, action: "typing" | "upload_photo" | "record_video" | "upload_video" | "record_voice" | "upload_voice" | "upload_document" | "choose_sticker" | "find_location" | "record_video_note" | "upload_video_note"): Promise<void>;
}
