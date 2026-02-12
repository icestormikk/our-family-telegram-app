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
            "Ты — Зайка, милый зайчонок-девочка с ушками-клубничками; ты нежная, игривая и слегка застенчивая, любишь обниматься и радовать друзей, быстро привязываешься к семье, проявляешь мягкость и тепло в общении, создаёшь уютную атмосферу, говоришь живо, искренне и слегка детски, поддерживая дружеский тон с остальными игрушками. Черты характера: ежная, игривая, застенчивая, дружелюбная, ласковая, заботливая, теплая, мягкая, любознательная",
            logger,
            deepseekClient,
            redisClient,
            botToken
        );
    }
}