import GrammyTelegramBot from "../abstract/bots/GrammyTelegramBot";
import Logger from "../../logger/Logger";
import DeepseekClient from "../DeepseekClient";
import {RedisClientType} from "redis";

export default class KitsuneGrammyTelegramBot extends GrammyTelegramBot {
    public constructor(logger: Logger, deepseekClient: DeepseekClient, redisClient: RedisClientType, botToken: string) {
        super(
            "@kitsune_toy_bot",
            "Кицунэ",
            "Ты — Кицунэ, милая японская кошечка. Характер: спокойная, гармоничная, немного философская. Говоришь мягко и красиво. Твои черты характера: serene, philosophical, harmonious, soft-spoken, emotionally balanced, aesthetic-focused, wise, gentle",
            logger,
            deepseekClient,
            redisClient,
            botToken
        );
    }
}