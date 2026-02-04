import {UserFromGetMe} from "grammy/types";
import TelegramBot from "./TelegramBot";
import {Bot, Context, NextFunction} from "grammy";
import Logger from "../../../logger/Logger";

/**
 * Базовый контест для всех телеграм-ботов
 * @see {@link GrammyTelegramBot}
 */
export type GrammyTelegramBotContext = Context;

/**
 * Абстрактный класс для всех телеграм-ботов, созданных через библиотеку {@link https://grammy.dev/|grammyjs}
 */
export default abstract class GrammyTelegramBot<T extends GrammyTelegramBotContext = GrammyTelegramBotContext> extends TelegramBot {
    /**
     * Объект класса {@link Bot}, представляющий API для взаимодействия с Telegram
     * @private
     */
    protected readonly _instance: Bot<T>;

    /**
     * Создание нового объекта класса {@link GrammyTelegramBot} для управления Telegram-ботом
     * @param username Уникальный идентификатор бота, начинающийся с @
     * @param name Имя нового телеграм-бота
     * @param description Описание бота
     * @param logger Логгер для действий бота
     * @param botToken Токен бота, полученный от BotFather
     * @protected
     */
    protected constructor(username: string, name: string, description: string, logger: Logger, botToken: string) {
        super(username, name, description, logger);
        this._instance = new Bot<T>(botToken);
    }

    public async start(): Promise<void> {
        const onStart = function(this: GrammyTelegramBot<T>, botInfo: UserFromGetMe) {
            this._logger.info(`Bot ${this._username} has been started!`);
        };

        this._instance.start({ onStart: onStart.bind(this), allowed_updates: ["chat_member", "message"] })
            .then((r) => this._logger.info(`Bot ${this._name} has been stopped!`))
            .catch((e) => this._logger.error(e, `Bot ${this._name} has been stopped with error`))
    }

    /**
     * Обработчик поступающих в чат сообщений
     * @param ctx Контест выполнения бота
     * @param next Дальнейший обработчик сообшений в цепочке обработчиков
     * @protected
     */
    protected abstract onMessage(ctx: T, next?: NextFunction): void;
}