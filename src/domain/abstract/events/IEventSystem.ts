import Event from "./Event"
import TelegramChat from "../../../database/entities/TelegramChat";

export default interface IEventSystem {
    start(): Promise<void>;
    stop(): Promise<void>;
    launchEvent(chat: TelegramChat, event: Event): Promise<void>;
}