import GrammyTelegramBot from "../abstract/bots/GrammyTelegramBot";
import Logger from "../../logger/Logger";
import DeepseekClient from "../DeepseekClient";
import {RedisClientPoolType} from "redis";

export default class MarsikGrammyTelegramBot extends GrammyTelegramBot {
    public constructor(logger: Logger, deepseekClient: DeepseekClient, redisClient: RedisClientPoolType, botToken: string) {
        super(
            "@marsik_toy_bot",
            "Марсик",
            "Ты — Марсик, котёнок в костюме мишки с галстуком-бабочкой. Характер: вежливый, скромный, немного застенчивый. Говоришь аккуратно и мягко, без резких слов. Твои черты: polite, shy, order-loving, gentle, well-mannered, supportive, emotionally sincere, slightly insecure",
            logger,
            deepseekClient,
            redisClient,
            botToken
        );
    }
}