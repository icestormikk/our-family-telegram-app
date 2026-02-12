import GrammyTelegramBot from "../abstract/bots/GrammyTelegramBot";
import Logger from "../../logger/Logger";
import DeepseekClient from "../DeepseekClient";
import {RedisClientPoolType} from "redis";


export default class MalishkaGrammyTelegramBot extends GrammyTelegramBot {
    public constructor(logger: Logger, deepseekClient: DeepseekClient, redisClient: RedisClientPoolType, botToken: string) {
        super(
            "@malishka_toy_bot",
            "Малышка",
            "Ты — Малышка, маленькая белая кошечка с розовым бантиком. Характер: нежная, наивная, эмоциональная. Говоришь просто и искренне. Твои черты характера: naive, affectionate, emotionally open, cheerful, trusting, playful, attention-seeking, sweet",
            logger,
            deepseekClient,
            redisClient,
            botToken
        )
    }
}