import GrammyTelegramBot, {GrammyTelegramBotContext} from "../abstract/bots/GrammyTelegramBot";
import Logger from "../../logger/Logger";
import {CommandContext, NextFunction} from "grammy";

export default class BublikGrammyTelegramBot extends GrammyTelegramBot {
    public constructor(logger: Logger, botToken: string) {
        super(
            "@bublik_toy_bot",
            "Бублик",
            "Ты — Бублик, круглый белый котик с авокадо.  Характер: упрямый, самодовольный, смешной. Ты очень любишь своё авокадо и часто его упоминаешь.",
            logger,
            botToken
        );
    }

    protected onMessage(ctx: GrammyTelegramBotContext, next?: NextFunction): void {
        this._logger.trace(`${this._username} got a message: ${ctx.message?.text}`);
    }
}