import { UserFromGetMe } from "grammy/types";
import TelegramBot from "./TelegramBot";
import {Bot, Context} from "grammy";
import Logger from "../../../logger/Logger";

/**
 * Абстрактный класс для всех телеграм-ботов, созданных через библиотеку {@link https://grammy.dev/|grammyjs}
 */
export default abstract class GrammyTelegramBot extends TelegramBot {
    /**
     * Объект класса {@link Bot}, представляющий API для взаимодействия с Telegram
     * @private
     */
    protected readonly _instance: Bot;

    /**
     * Создание нового объекта класса {@link GrammyTelegramBot} для управления Telegram-ботом
     * @param id Уникальный идентификатор бота, начинающийся с @
     * @param name Имя нового телеграм-бота
     * @param description Описание бота
     * @param logger Логгер для действий бота
     * @param botToken Токен бота, полученный от BotFather
     * @protected
     */
    protected constructor(id: string, name: string, description: string, logger: Logger, botToken: string) {
        super(id, name, description, logger);
        this._instance = new Bot(botToken);
    }

    public async start(): Promise<void> {
        const onStart = function(this: GrammyTelegramBot, botInfo: UserFromGetMe) {
            this._instance.on("message", this.onMessage.bind(this));

            this._logger.info(`Bot ${this._id} has been started!`);
        };


        this._instance.start({ onStart: onStart.bind(this) })
            .then((r) => this._logger.info(`Bot ${this._name} has been stopped!`))
            .catch((e) => this._logger.error(e, `Bot ${this._name} has been stopped with error`))
    }

    private async onMessage(ctx: Context) {
        const text = ctx.message?.text;

        if(!(text != null && text.startsWith(this._id)))
            return;

        this._logger.trace(`${this._name} got a message (${JSON.stringify(ctx.message?.from)}): ${text}`)
    }
}