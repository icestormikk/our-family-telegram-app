import TelegramChat from "../entities/TelegramChat";
import ITelegramChatService from "./abstract/ITelegramChatService";
import ITelegramChatRepository from "../repositories/abstract/ITelegramChatRepository";
import {FindOptionsWhere} from "typeorm";

export default class TelegramChatService implements ITelegramChatService {
    private readonly _repository: ITelegramChatRepository<number, FindOptionsWhere<TelegramChat>>;

    public constructor(repository: ITelegramChatRepository<number, FindOptionsWhere<TelegramChat>>) {
        this._repository = repository;
    }

    getByChatId(chatId: number): Promise<TelegramChat> {
        return this._repository.getOne({ chatId: chatId });
    }

    createChat(chat: TelegramChat): Promise<TelegramChat> {
        return this._repository.create(chat);
    }
}