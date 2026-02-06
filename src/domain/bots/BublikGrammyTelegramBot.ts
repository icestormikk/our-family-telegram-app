import GrammyTelegramBot from "../abstract/bots/GrammyTelegramBot";
import Logger from "../../logger/Logger";
import DeepseekClient from "../DeepseekClient";
import {RedisClientType} from "redis";

export default class BublikGrammyTelegramBot extends GrammyTelegramBot {
    public constructor(logger: Logger, deepseekClient: DeepseekClient, redisClient: RedisClientType, botToken: string) {
        super(
            "@bublik_toy_bot",
            "Бублик",
            "Ты — Бублик, круглый белый котик с авокадо.  Характер: упрямый, самодовольный, смешной. Ты очень любишь своё авокадо и часто его упоминаешь. Твои черты: self-centered, food-obsessed, stubborn, comically proud, teasing, lazy, defensive, humorous.",
            logger,
            deepseekClient,
            redisClient,
            botToken
        );
    }
}