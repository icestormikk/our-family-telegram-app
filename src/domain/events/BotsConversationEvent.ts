import Event from "../abstract/events/Event";
import Logger from "../../logger/Logger";

export default class BotsConversationEvent extends Event {
    public constructor(logger: Logger) {
        super("bot-conversation-event", logger);
    }
}