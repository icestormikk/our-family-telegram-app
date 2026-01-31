import GrammyTelegramBot from "../../entities/bots/GrammyTelegramBot";

export default interface IGrammyTelegramBotRepository<ID, FindOptions> {
    getAll(): Promise<GrammyTelegramBot[]>;
    getMany(options: FindOptions): Promise<GrammyTelegramBot[]>;
    getOne(options: FindOptions): Promise<GrammyTelegramBot>;
    create(grammyBot: GrammyTelegramBot): Promise<GrammyTelegramBot>;
    updateById(id: ID, data: GrammyTelegramBot): Promise<GrammyTelegramBot>
    deleteById(id: ID): Promise<void>;
}