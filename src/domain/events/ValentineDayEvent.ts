import DatetimeEvent from "../abstract/events/DatetimeEvent";
import TelegramChat from "../../database/entities/TelegramChat";
import BotsContainer from "../bots/BotsContainer";
import DeepseekClient from "../DeepseekClient";
import Logger from "../../logger/Logger";
import ITelegramChatService from "../../database/services/abstract/ITelegramChatService";

export default class ValentineDayEvent extends DatetimeEvent {
    private readonly _deepseekClient: DeepseekClient;
    private readonly _telegramChatService: ITelegramChatService;

    public constructor(logger: Logger, telegramChatService: ITelegramChatService, deepseekClient: DeepseekClient) {
        const now = new Date()
        const start = new Date(now.getFullYear(), 1, 7, 0, 0, 0);
        const end = new Date(now.getFullYear(), 1, 8, 0, 0, 0);

        super("valentine-day-event", start, end, logger)

        this._deepseekClient = deepseekClient;
        this._telegramChatService = telegramChatService;
    }

    async launch(chat: TelegramChat): Promise<void> {
        try {
            if(chat.pastEventsIds.includes(this._id))
                return;

            await super.launch(chat);

            const chatId = chat.chatId;
            const allBots =  BotsContainer.getAllBots();
            const celebrator = allBots[Math.floor(Math.random() * allBots.length)];

            await celebrator.sendChatAction(chatId, "typing");
            const celebrationText = await this._deepseekClient.celebrate("valentine-day", "моя девушка Даша");
            await celebrator.sendWithAnimation(chatId, "./resources/gifs/valentine-day-cat-luna.gif", celebrationText);

            chat.pastEventsIds.push(this._id);
            await this._telegramChatService.updateChatById(chat.id, chat);
        } catch (e: any) {
            this._logger.error(e,`Error while executing ${this._id} event`)
        }
    }
}