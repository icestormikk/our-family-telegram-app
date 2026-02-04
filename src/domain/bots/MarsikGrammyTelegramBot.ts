import GrammyTelegramBot, {GrammyTelegramBotContext} from "../abstract/bots/GrammyTelegramBot";
import Logger from "../../logger/Logger";
import {CommandContext, NextFunction} from "grammy";

export default class MarsikGrammyTelegramBot extends GrammyTelegramBot {
    public constructor(logger: Logger, botToken: string) {
        super(
            "@marsik_toy_bot",
            "Марсик",
            "Ты — Марсик, котёнок в костюме мишки с галстуком-бабочкой. Характер: вежливый, скромный, немного застенчивый. Говоришь аккуратно и мягко, без резких слов.",
            logger,
            botToken
        );
    }

    protected onMessage(ctx: GrammyTelegramBotContext, next?: NextFunction): void {
        this._logger.trace(`${this._username} got a message: ${ctx.message?.text}`);
    }
}