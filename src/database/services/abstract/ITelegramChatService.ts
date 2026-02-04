import TelegramChat from "../../entities/TelegramChat";

export default interface ITelegramChatService {
    getAllChats(): Promise<TelegramChat[]>;
    getByChatId(chatId: number): Promise<TelegramChat|null>;
    createChat(chat: TelegramChat): Promise<TelegramChat>;
    updateChatById(id: number, chat: TelegramChat): Promise<TelegramChat>;
}