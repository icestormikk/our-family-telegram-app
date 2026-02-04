import Logger from "../../../logger/Logger";
import TelegramChat from "../../../database/entities/TelegramChat";

export default abstract class Event {
    protected readonly _id: string;
    protected readonly _logger: Logger;

    protected constructor(id: string, logger: Logger) {
        this._id = id;
        this._logger = logger;
    }

    public launch(chat: TelegramChat): Promise<void> {
        this._logger.trace(`Event ${this._id} has been launched in chat with ${chat.chatId} id.`)
        return Promise.resolve();
    }
}