import Logger from "../../logger/Logger";
import RandomEvent from "../abstract/events/RandomEvent";
import TelegramChat from "../../database/entities/TelegramChat";

export default class InteractionWithUserEvent extends RandomEvent {
    public constructor(logger: Logger) {
        super("interaction-with-user-event", logger, 0.2);
    }

    public async launch(chat: TelegramChat): Promise<void> {
    }
}