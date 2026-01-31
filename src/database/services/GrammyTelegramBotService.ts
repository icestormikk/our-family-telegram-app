import GrammyTelegramBot from "../entities/bots/GrammyTelegramBot";
import IGrammyTelegramBotService from "./abstract/IGrammyTelegramBotService";
import IGrammyTelegramBotRepository from "../repositories/abstract/IGrammyTelegramBotRepository";
import {FindOptionsWhere} from "typeorm";

export default class GrammyTelegramBotService implements IGrammyTelegramBotService {
    private readonly _repository: IGrammyTelegramBotRepository<number, FindOptionsWhere<GrammyTelegramBot>>;

    public constructor(repository: IGrammyTelegramBotRepository<number, FindOptionsWhere<GrammyTelegramBot>>) {
        this._repository = repository;
    }

    getByTelegramId(telegramId: string): Promise<GrammyTelegramBot> {
        return this._repository.getOne({ telegramId: telegramId });
    }

    createBot(bot: GrammyTelegramBot): Promise<GrammyTelegramBot> {
        return this._repository.create(bot);
    }
}