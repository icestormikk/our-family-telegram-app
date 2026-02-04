import IEventSystem from "../abstract/events/IEventSystem";
import ITelegramChatService from "../../database/services/abstract/ITelegramChatService";
import Logger from "../../logger/Logger";
import TelegramChat from "../../database/entities/TelegramChat";
import InteractionWithUserEvent from "./InteractionWithUserEvent";
import Event from "../../domain/abstract/events/Event";
import {schedule} from "node-cron";

export default class EventSystem implements IEventSystem {
    private static Instance: EventSystem;
    private static readonly EventsTimeoutMs = 3_600_000;

    private readonly _telegramChatService: ITelegramChatService;
    private readonly _logger: Logger;
    private readonly _events: Event[];

    protected constructor(telegramChatService: ITelegramChatService, logger: Logger) {
        this._telegramChatService = telegramChatService;
        this._logger = logger;
        this._events = [new InteractionWithUserEvent(logger)];

        // schedule("* * * * * *", this.checkEvents.bind(this), { noOverlap: true });
    }

    protected async checkEvents(): Promise<void> {
        const chats = await this._telegramChatService.getAllChats();

        for(const chat of chats) {
            const { lastMessageTime } = chat;

            if(!lastMessageTime || Math.abs(new Date().getTime() - lastMessageTime.getTime()) > EventSystem.EventsTimeoutMs)
                this.launchEvent(chat);
        }
    }

    public static get(telegramChatService: ITelegramChatService, logger: Logger): IEventSystem {
        if(!EventSystem.Instance)
            EventSystem.Instance = new EventSystem(telegramChatService, logger);

        return EventSystem.Instance;
    }

    public async launchEvent(chat: TelegramChat): Promise<void> {
        const index = Math.floor(this._events.length * Math.random());
        const event = this._events[index];

        if(!event)
            return;

        await event.launch(chat);
    }
}