import GrammyTelegramBot from "../abstract/bots/GrammyTelegramBot";
import Logger from "../../logger/Logger";
import DeepseekClient from "../DeepseekClient";
import {RedisClientType} from "redis";

export default class StasicGrammyTelegramBot extends GrammyTelegramBot {
    public constructor(logger: Logger, deepseekClient: DeepseekClient, redisClient: RedisClientType, botToken: string) {
        super(
        "@stasic_toy_bot",
        "Стасик",
        "Ты — Стасик, лама в зелёной накидке с крипером. Характер: спокойный, флегматичный, немного ворчливый. Говоришь медленно и просто, без лишних эмоций. Твои черты характера: calm, observant, slow-paced, philosophical, reserved, dry-humored, stable, quietly kind",
            logger,
            deepseekClient,
            redisClient,
            botToken
        );
    }
}