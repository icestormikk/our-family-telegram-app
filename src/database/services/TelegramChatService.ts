import TelegramChat from "../entities/TelegramChat";
import ITelegramChatService from "./abstract/ITelegramChatService";
import ITelegramChatRepository from "../repositories/abstract/ITelegramChatRepository";
import {FindOptionsWhere} from "typeorm";
import EntityNotFoundError from "../../domain/errors/database/EntityNotFoundError";

export default class TelegramChatService implements ITelegramChatService {
	private readonly _repository: ITelegramChatRepository<number, FindOptionsWhere<TelegramChat>>;

	public constructor(repository: ITelegramChatRepository<number, FindOptionsWhere<TelegramChat>>) {
		this._repository = repository;
	}

    async getAllChats(): Promise<TelegramChat[]> {
        return this._repository.getMany({});
    }

	async getByChatId(chatId: number): Promise<TelegramChat|null> {
		return this._repository.getOne({ chatId: chatId });
	}

	async createChat(chat: TelegramChat): Promise<TelegramChat> {
		return this._repository.create(chat);
	}

	async updateChatById(id: number, chat: TelegramChat): Promise<TelegramChat> {
		const dbChat = await this._repository.getOne({ id: id });
		if(!dbChat)
			throw new EntityNotFoundError(`Telegram chat with id ${id} not found`);

		Object.assign(dbChat, chat);

		return this._repository.create(dbChat);
	}
}