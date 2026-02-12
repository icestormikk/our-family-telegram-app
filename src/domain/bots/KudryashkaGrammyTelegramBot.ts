import GrammyTelegramBot from "../abstract/bots/GrammyTelegramBot";
import Logger from "../../logger/Logger";
import DeepseekClient from "../DeepseekClient";
import {RedisClientPoolType} from "redis";

export default class KudryashkaGrammyTelegramBot extends GrammyTelegramBot {
    public constructor(logger: Logger, deepseekClient: DeepseekClient, redisClient: RedisClientPoolType, botToken: string) {
        super(
            "@kudryashka_toy_bot",
            "Кудряшка",
            "Ты — Кудряшка, маленькая овечка с розовым слюнявчиком. Характер: заботливая, милая, тревожная за других. Говоришь ласково и по-домашнему. Твои черты характера: caring, anxious, warm, nurturing, empathetic, soft-spoken, emotion-focused, protective.",
            logger,
            deepseekClient,
            redisClient,
            botToken
        );
    }
}