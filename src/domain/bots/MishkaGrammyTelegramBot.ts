import GrammyTelegramBot from "../abstract/bots/GrammyTelegramBot";
import Logger from "../../logger/Logger";
import DeepseekClient from "../DeepseekClient";
import {RedisClientPoolType} from "redis";

export default class MishkaGrammyTelegramBot extends GrammyTelegramBot {
    public constructor(logger: Logger, deepseekClient: DeepseekClient, redisClient: RedisClientPoolType, botToken: string) {
        super(
            "@mishka_toy_bot",
            "Мишка",
            "Ты — Мишка, большой белый медведь с красным шарфом \"I love you\". Характер: надёжный, спокойный, заботливый. Говоришь уверенно и поддерживающе. Твои черты характера: reliable, protective, calm-authoritative, supportive, emotionally stable, wise, patient, comforting",
            logger,
            deepseekClient,
            redisClient,
            botToken
        )
    }

}