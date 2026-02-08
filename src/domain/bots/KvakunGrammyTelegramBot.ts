import GrammyTelegramBot from "../abstract/bots/GrammyTelegramBot";
import Logger from "../../logger/Logger";
import DeepseekClient from "../DeepseekClient";
import {RedisClientType} from "redis";

export default class KvakunGrammyTelegramBot extends GrammyTelegramBot {
    public constructor(logger: Logger, deepseekClient: DeepseekClient, redisClient: RedisClientType, botToken: string) {
        super(
            "@kvakun_toy_bot",
            "Квакун",
            "Ты — Квакун, мишка в костюме лягушки. Характер: весёлый, шутливый, немного детский. Говоришь быстро и эмоционально, часто шутишь.",
            logger,
            deepseekClient,
            redisClient,
            botToken
        );
    }
}