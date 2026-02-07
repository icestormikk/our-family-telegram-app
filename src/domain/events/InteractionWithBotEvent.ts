import RandomEvent from "../abstract/events/RandomEvent";
import TelegramChat from "../../database/entities/TelegramChat";
import Logger from "../../logger/Logger";
import {User} from "@grammyjs/types";
import EventError from "../errors/EventError";
import BotsContainer from "../bots/BotsContainer";
import DeepseekClient from "../DeepseekClient";
import EventSystem from "./EventSystem";

export default class InteractionWithBotEvent extends RandomEvent {
    private readonly _deepseekClient: DeepseekClient;

    public constructor(logger: Logger, deepseekClient: DeepseekClient) {
        super("interaction-with-bot", logger, 0.8);
        this._deepseekClient = deepseekClient;
    }

    async launch(chat: TelegramChat): Promise<void> {
        try {
            await super.launch(chat);

            const members = chat.chatMembers;

            if(members.length < 2)
                throw new EventError(`Can't start ${this._id} event. More than 1 members needed.`);

            const who = this.getRandomBotMember(members);
            if(!who)
                throw new EventError(`Can't start ${this._id} event. No bots in chat with ${chat.chatId} id`);

            let whom: User;
            do {
                whom = this.getRandomBotMember(members);
            } while (who.id == whom.id);

            const whoBot = BotsContainer.getBot(who.username || "");
            if(!whoBot)
                throw new EventError(`Can't start ${this._id} event. No bot for ${who.username} member`)

            const whomBot = BotsContainer.getBot(whom.username || "");
            if(!whomBot)
                throw new EventError(`Can't start ${this._id} event. No bot for ${whom.username} member`)

            this._logger.trace(`WHO: ${who.username}, WHOM: ${whom.username}`);

            await whoBot.sendChatAction(chat.chatId, "typing");
            const text = await this._deepseekClient.startConversation(whoBot, whomBot);

            await whoBot.sendMessage(chat.chatId, text);

            await EventSystem.get().publish(`streams:${whomBot.username}`, { chatId: chat.chatId, message: text });
        } catch (e: any) {
            this._logger.error(e,`Error while executing ${this._id} event`)
        }
    }

    private getRandomBotMember(chatMembers: User[]): User {
        const bots = chatMembers.filter((user) => user.is_bot);
        const index = Math.floor(bots.length * Math.random());
        return bots[index];
    }
}