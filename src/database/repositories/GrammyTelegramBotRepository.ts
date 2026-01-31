import GrammyTelegramBot from "../entities/bots/GrammyTelegramBot";
import IGrammyTelegramBotRepository from "./abstract/IGrammyTelegramBotRepository";
import {DataSource, FindOptionsWhere, Repository} from "typeorm";
import ICrypto from "../../domain/abstract/ICrypto";

export default class GrammyTelegramBotRepository implements IGrammyTelegramBotRepository<number, FindOptionsWhere<GrammyTelegramBot>> {
    private readonly _repository: Repository<GrammyTelegramBot>;
    private readonly _crypto: ICrypto;

    public constructor(dataSource: DataSource, crypto: ICrypto) {
        this._repository = dataSource.getRepository(GrammyTelegramBot);
        this._crypto = crypto;
    }

    async getAll(): Promise<GrammyTelegramBot[]> {
        return this._repository.find();
    }

    async getMany(options: FindOptionsWhere<GrammyTelegramBot>): Promise<GrammyTelegramBot[]> {
        return this._repository.findBy(options);
    }

    async getOne(options: FindOptionsWhere<GrammyTelegramBot>): Promise<GrammyTelegramBot> {
        return this._repository.findOneByOrFail(options);
    }

    async create(grammyBot: GrammyTelegramBot): Promise<GrammyTelegramBot> {
        const { token } = grammyBot;

        grammyBot.token = this._crypto.encrypt(token);

        return this._repository.save(grammyBot);
    }

    async updateById(id: number, data: GrammyTelegramBot): Promise<GrammyTelegramBot> {
        const bot = await this.getOne({ id: id });

        Object.assign(bot, data);

        return this._repository.save(bot);
    }

    async deleteById(id: number): Promise<void> {
        await this._repository.delete({ id: id });
    }
    
}