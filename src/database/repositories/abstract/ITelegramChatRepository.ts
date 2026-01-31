import TelegramChat from "../../entities/TelegramChat";

export default interface ITelegramChatRepository<ID, FindOptions> {
    getAll(): Promise<TelegramChat[]>;
    getMany(options: FindOptions): Promise<TelegramChat[]>;
    getOne(options: FindOptions): Promise<TelegramChat>;
    create(chat: TelegramChat): Promise<TelegramChat>;
    updateById(id: ID, data: TelegramChat): Promise<TelegramChat>;
    deleteById(id: ID): Promise<void>;
}