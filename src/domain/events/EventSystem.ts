import IEventSystem from "../abstract/events/IEventSystem";
import ITelegramChatService from "../../database/services/abstract/ITelegramChatService";
import Logger from "../../logger/Logger";
import TelegramChat from "../../database/entities/TelegramChat";
import Event from "../../domain/abstract/events/Event";
import {schedule, ScheduledTask} from "node-cron";
import InteractionWithBotEvent from "./InteractionWithBotEvent";
import DeepseekClient from "../DeepseekClient";
import RedisStreamPublisher from "../abstract/redis/RedisStreamPublisher";
import {RedisClientPoolType, RedisClientType} from "redis";
import ValentineDayEvent from "./ValentineDayEvent";
import DatetimeEvent from "../abstract/events/DatetimeEvent";

export default class EventSystem implements IEventSystem, RedisStreamPublisher {
    private static Instance: EventSystem;
    private static readonly EventsTimeoutMs = /*3_600_000*/60_000;

    private readonly _telegramChatService: ITelegramChatService;
    private readonly _redisClient: RedisClientPoolType;
    private readonly _logger: Logger;
    private readonly _datetimeEvents: DatetimeEvent[];
    private readonly _events: Event[];

    private _checkEventsJob: ScheduledTask;

    protected constructor(telegramChatService: ITelegramChatService, logger: Logger, redisClient: RedisClientPoolType, deepseekClient: DeepseekClient) {
        this._telegramChatService = telegramChatService;
        this._redisClient = redisClient;
        this._logger = logger;
        this._datetimeEvents = [new ValentineDayEvent(logger, telegramChatService, deepseekClient)];
        this._events = [new InteractionWithBotEvent(logger, deepseekClient)];
    }

    async start(): Promise<void> {
        this._checkEventsJob = schedule("* * * * *", this.checkEvents.bind(this));
    }

    async stop(): Promise<void> {
        this._checkEventsJob.destroy();
    }

    protected async checkEvents(): Promise<void> {
        const chats = await this._telegramChatService.getAllChats();

        for(const chat of chats) {
            try {
                for(const datetimeEvent of this._datetimeEvents)
                    await datetimeEvent.launch(chat);

                const { lastMessageTime } = chat;

                if(!lastMessageTime || Math.abs(new Date().getTime() - lastMessageTime.getTime()) > EventSystem.EventsTimeoutMs) {
                    await this.launchEvent(chat, this._events[Math.floor(this._events.length * Math.random())]);
                    chat.lastMessageTime = new Date();
                    await this._telegramChatService.updateChatById(chat.id, chat);
                }
            } catch (e: any) {
                this._logger.error(e, `Error while executing event in ${chat.chatId} chat`);
            }
        }
    }

    public static init(telegramChatService: ITelegramChatService, logger: Logger, redisClient: RedisClientPoolType, deepseekClient: DeepseekClient): EventSystem {
        if(!EventSystem.Instance)
            EventSystem.Instance = new EventSystem(telegramChatService, logger, redisClient, deepseekClient);

        return EventSystem.Instance;
    }

    public static get(): EventSystem {
        if(!EventSystem.Instance)
            throw new Error("Event System is not initialized! Call EventSystem.init(..) method first.")

        return EventSystem.Instance;
    }

    public async launchEvent(chat: TelegramChat, event: Event): Promise<void> {
        await event.launch(chat);
    }

    async publish(stream: string, data: object): Promise<string> {
        this._logger.trace(`Publishing message ${JSON.stringify(data)} to ${stream}`)
        const res = await this._redisClient.xAdd(stream, "*", {data: JSON.stringify(data)});
        this._logger.trace(`Successfully published message to ${stream} (id: ${res})`)

        return res;
    }
}