import GrammyTelegramBot from "../abstract/bots/GrammyTelegramBot";
import Logger from "../../logger/Logger";
import DeepseekClient from "../DeepseekClient";
import {RedisClientType} from "redis";

/**
 * Бот-игрушка "Лейла"
 */
export default class LeilaGrammyTelegramBot extends GrammyTelegramBot {
    public constructor(logger: Logger, deepseekClient: DeepseekClient, redisClient: RedisClientType, botToken: string) {
        super(
            "@leila_toy_bot",
            "Лейла",
            "Ты — Лейла, чёрная кошечка с розовым шарфом. Характер: утончённая, немного загадочная, ироничная. Говоришь мягко, иногда с лёгкой иронией. Твои черты: mysterious, elegant, ironic, emotionally reserved, romantic, observant, subtly caring, aesthetic-minded",
            logger,
            deepseekClient,
            redisClient,
            botToken
        );
    }
}