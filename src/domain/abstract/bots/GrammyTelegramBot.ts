import {UserFromGetMe} from "grammy/types";
import TelegramBot from "./TelegramBot";
import {Bot, Context, InputFile} from "grammy";
import Logger from "../../../logger/Logger";
import DeepseekClient from "../../DeepseekClient";
import RedisStreamConsumer from "../redis/RedisStreamConsumer";
import {RedisClientPoolType} from "redis";
import {schedule, ScheduledTask} from "node-cron";

/**
 * Базовый контест для всех телеграм-ботов
 * @see {@link GrammyTelegramBot}
 */
export type GrammyTelegramBotContext = Context;

/**
 * Абстрактный класс для всех телеграм-ботов, созданных через библиотеку {@link https://grammy.dev/|grammyjs}
 */
export default abstract class GrammyTelegramBot<T extends GrammyTelegramBotContext = GrammyTelegramBotContext> extends TelegramBot implements RedisStreamConsumer {
    /**
     * Объект для составления и отправки запроса к нейросетевым чат-моделям
     * @protected
     */
    protected readonly _deepseekClient: DeepseekClient;
    /**
     * Объект для взаимодействия с хранилищем Redis
     * @protected
     */
    protected readonly _redisClient: RedisClientPoolType;
    /**
     * Объект класса {@link Bot}, представляющий API для взаимодействия с Telegram
     * @private
     */
    protected readonly _instance: Bot<T>;

    private redisCronJob: ScheduledTask;

    /**
     * Создание нового объекта класса {@link GrammyTelegramBot} для управления Telegram-ботом
     * @param username Уникальный идентификатор бота, начинающийся с @
     * @param name Имя нового телеграм-бота
     * @param description Описание бота
     * @param logger Логгер для действий бота
     * @param deepseekClient Объект для составления и отправки запроса к нейросетевым чат-моделям
     * @param redisClient Объект для взаимодействия с хранилищем данных Redis
     * @param botToken Токен бота, полученный от BotFather
     * @protected
     */
    protected constructor(username: string, name: string, description: string, logger: Logger, deepseekClient: DeepseekClient, redisClient: RedisClientPoolType, botToken: string) {
        super(username, name, description, logger);
        this._instance = new Bot<T>(botToken);
        this._instance.on("message", this.onMessage.bind(this));
        this._deepseekClient = deepseekClient;
        this._redisClient = redisClient;
    }

    public async start(): Promise<void> {
        this._instance
            .start({ onStart: this.onBotStarted.bind(this), allowed_updates: ["chat_member", "message"] })
            .then((r) => this._logger.info(`Bot ${this.username} has been stopped!`))
            .catch((e) => this._logger.error(e, `Bot ${this.username} has been stopped with error`))
    }

    public async stop(): Promise<void> {
        await this._instance.stop();
        await this.redisCronJob.destroy();
    }

    protected async onBotStarted(botInfo: UserFromGetMe): Promise<void> {
        this._logger.info(`Bot ${this.username} has been started!`);

        try {
            await this._redisClient.xGroupCreate(`streams:${this.username}`, `groups:${this.username}`, "$", { MKSTREAM: true });
        } catch (e: any) {
            if (!e.message.includes('BUSYGROUP'))
                console.error(e);
        }

        this.redisCronJob = schedule("*/10 * * * * *", async () => { await this.consume() });
    }

    protected async onMessage(ctx: T): Promise<void> {
        this._logger.trace(ctx.message?.text + " : " + this.username);
        const text = ctx.message?.text;
        if(!text)
            return;

        this._logger.trace(`${this.username} is mentioned? ${text.includes(this.username)}`)
        if(text.includes(this.username))
            await this.onMention(ctx);
    }

    protected async onMention(ctx: T) {
        this._logger.trace(`${this.username} mentioned`)
        const response = await this._deepseekClient.replyToMessage(this, ctx.message!.text!);
        await ctx.reply(response, { reply_to_message_id: ctx.message?.message_id });
    }

    public async sendMessage(chatId: number, message: string, replyToId?: number): Promise<number> {
        const sentMessage = await this._instance.api.sendMessage(chatId, message, { reply_to_message_id: replyToId });
        return sentMessage.message_id;
    }

    async sendWithAnimation(chatId: number, animationFilepath: string, caption?: string): Promise<number> {
        const sentAnimation = await this._instance.api.sendAnimation(chatId, new InputFile(animationFilepath), { caption: caption });
        return sentAnimation.message_id;
    }

    public async sendChatAction(chatId: number, action: "typing" | "upload_photo" | "record_video" | "upload_video" | "record_voice" | "upload_voice" | "upload_document" | "choose_sticker" | "find_location" | "record_video_note" | "upload_video_note"): Promise<void> {
        await this._instance.api.sendChatAction(chatId, action);
    }

    // Redis >>>

    async consume(): Promise<void> {
        const redisStreams = await this._redisClient.xReadGroup(
            `groups:${this.username}`,
            this.username,
            [{ key: `streams:${this.username}`, id: '>' }],
            { BLOCK: 5_000, COUNT: 1 }
        )

        if(!redisStreams) return;

        for(const stream of redisStreams) {
            for(const message of stream.messages) {
                this._logger.trace(`Start ack message ${message.id} in ${this.username}`);
                await this._redisClient.xAck(`streams:${this.username}`, `groups:${this.username}`, message.id);
                this._logger.trace(`Successfully ack message ${message.id} in ${this.username}`);

                this._logger.trace(`Handling message ${message.id} in streams:${this.username}`);
                const data = message.message.data;
                const botMessage = JSON.parse(data) as { message: string, chatId: number };

                await this.sendChatAction(botMessage.chatId, "typing");
                const reply = await this._deepseekClient.replyToMessage(this, botMessage.message);
                await this.sendMessage(botMessage.chatId, reply);
            }
        }
    }

    // Redis <<<
}