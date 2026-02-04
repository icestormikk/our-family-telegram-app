import TelegramChat from "../../../database/entities/TelegramChat";

export default interface IEventSystem {
    launchEvent(chat: TelegramChat): Promise<void>;
}