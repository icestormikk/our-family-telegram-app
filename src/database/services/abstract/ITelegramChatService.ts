import TelegramChat from "../../entities/TelegramChat";

export default interface ITelegramChatService {
    getByChatId(chatId: number): Promise<TelegramChat>;
    createChat(chat: TelegramChat): Promise<TelegramChat>;
}