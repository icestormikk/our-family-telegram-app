import TelegramBot from "../abstract/bots/TelegramBot";
import Event from "../abstract/events/Event";
import InteractionSystem from "../abstract/InteractionSystem";
import BotsConversationEvent from "../events/BotsConversationEvent";
import Logger from "../../logger/Logger";

export default class DefaultInteractionSystem implements InteractionSystem {
    private static readonly NoMessageTimeoutMs = 60_000;

    private readonly _events: Event[];

    private _noMessagesTimeout: number = -1;

    public constructor(logger: Logger) {
        this._events = [new BotsConversationEvent(logger)];
        this.resetNoMessageTimeout();
    }

    speak(who: TelegramBot, whom: TelegramBot): Promise<void>;

    speak(who: TelegramBot): Promise<void>;

    speak(who: unknown, whom?: unknown): Promise<void> {
        this.resetNoMessageTimeout();
        return Promise.resolve();
    }

    startEvent(event: Event): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private resetNoMessageTimeout(): void {
        clearTimeout(this._noMessagesTimeout);
        this._noMessagesTimeout = setTimeout(this.noMessageHandler.bind(this), DefaultInteractionSystem.NoMessageTimeoutMs);
    }

    private noMessageHandler() {
        const index = Math.floor(Math.random() * this._events.length);
        const event = this._events.at(index);

        if(!event)
            return;

        event.launch();

        this.resetNoMessageTimeout()
    }
}
