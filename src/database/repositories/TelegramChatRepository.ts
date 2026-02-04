import ITelegramChatRepository from "./abstract/ITelegramChatRepository";
import {DataSource, FindOptionsWhere, Repository} from "typeorm";
import TelegramChat from "../entities/TelegramChat";
import EntityNotFoundError from "../../domain/errors/database/EntityNotFoundError";

export default class TelegramChatRepository implements ITelegramChatRepository<number, FindOptionsWhere<TelegramChat>> {
    private readonly _repository: Repository<TelegramChat>;

    public constructor(dataSource: DataSource) {
        this._repository = dataSource.getRepository(TelegramChat);
    }

    async getAll(): Promise<TelegramChat[]> {
        return this._repository.find();
    }

    async getMany(options: FindOptionsWhere<TelegramChat>): Promise<TelegramChat[]> {
        return this._repository.findBy(options);
    }

    async getOne(options: FindOptionsWhere<TelegramChat>): Promise<TelegramChat|null> {
        return this._repository.findOneBy(options);
    }

    async create(chat: TelegramChat): Promise<TelegramChat> {
        return this._repository.save(chat);
    }

    async updateById(id: number, data: TelegramChat): Promise<TelegramChat> {
        const chat = await this.getOne({ id: id });
        if(!chat)
            throw new EntityNotFoundError(`Telegram chat with id ${id} not found`);

        Object.assign(chat, data);

        return this._repository.save(chat);
    }

    async deleteById(id: number): Promise<void> {
        await this._repository.delete({ id: id });
    }
}