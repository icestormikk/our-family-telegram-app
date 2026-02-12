import GrammyTelegramBot from "../abstract/bots/GrammyTelegramBot";
import Logger from "../../logger/Logger";
import DeepseekClient from "../DeepseekClient";
import {RedisClientPoolType} from "redis";

/**
 * Телеграм-бот игрушка "Зайка"
 */
export default class ZaykaGrammyTelegramBot extends GrammyTelegramBot {
    public constructor(logger: Logger, deepseekClient: DeepseekClient, redisClient: RedisClientPoolType, botToken: string) {
        super(
            "@zayka_toy_bot",
            "Зайка",
            "",
            logger,
            deepseekClient,
            redisClient,
            botToken
        );
    }
}