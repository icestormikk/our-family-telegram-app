import "reflect-metadata";
import PinoLogger from "./logger/PinoLogger";
import ProcessEnvironment from "./domain/environment/ProcessEnvironment";
import Logger from "./logger/Logger";
import Environment from "./domain/abstract/Environment";
import PostgresDatabase from "./database/datasource";
import TelegramChatRepository from "./database/repositories/TelegramChatRepository";
import TelegramChatService from "./database/services/TelegramChatService";
import AdministratorGrammyTelegramBot from "./domain/bots/AdministratorGrammyTelegramBot";
import BublikGrammyTelegramBot from "./domain/bots/BublikGrammyTelegramBot";
import MarsikGrammyTelegramBot from "./domain/bots/MarsikGrammyTelegramBot";
import EventSystem from "./domain/events/EventSystem";
import BotsContainer from "./domain/bots/BotsContainer";
import LeilaGrammyTelegramBot from "./domain/bots/LeilaGrammyTelegramBot";
import DeepseekClient from "./domain/DeepseekClient";
import {createClientPool, RedisClientPoolType} from "redis";
import StasicGrammyTelegramBot from "./domain/bots/StasicGrammyTelegramBot";
import KudryashkaGrammyTelegramBot from "./domain/bots/KudryashkaGrammyTelegramBot";
import KvakunGrammyTelegramBot from "./domain/bots/KvakunGrammyTelegramBot";
import KitsuneGrammyTelegramBot from "./domain/bots/KitsuneGrammyTelegramBot";
import MalishkaGrammyTelegramBot from "./domain/bots/MalishkaGrammyTelegramBot";
import MishkaGrammyTelegramBot from "./domain/bots/MishkaGrammyTelegramBot";
import LisichkaGrammyTelegramBot from "./domain/bots/LisichkaGrammyTelegramBot";
import ZaykaGrammyTelegramBot from "./domain/bots/ZaykaGrammyTelegramBot";

(async function() {
    const XLogger: Logger = new PinoLogger();
    const XEnvironment: Environment = new ProcessEnvironment(".env");

    try {
        XLogger.trace("Initializing database..")
        const XDatabase = await new PostgresDatabase(XEnvironment).initialize();
        XLogger.trace("Initialization of database ended successfully");

        const XTelegramChatRepository = new TelegramChatRepository(XDatabase);
        const XTelegramChatService = new TelegramChatService(XTelegramChatRepository);

        const XDeepseekClient = new DeepseekClient(XEnvironment.getString("DEEPSEEK_API_KEY"));

        const XRedisClientPool: RedisClientPoolType = createClientPool({ url: XEnvironment.getString("REDIS_URL") }, { minimum: 1, maximum: 40 });
        XRedisClientPool.on("error", (e) => XLogger.error(e, "Redis Client error"))
        await XRedisClientPool.connect();

        const XEventSystem = EventSystem.init(XTelegramChatService, XLogger, XRedisClientPool, XDeepseekClient);
        await XEventSystem.start();

        BotsContainer.registerBot("our_family_admin_bot", new AdministratorGrammyTelegramBot(XTelegramChatService, XLogger, XDeepseekClient, XRedisClientPool, XEnvironment.getString("BOT_TOKEN_ADMINISTRATOR")));
        BotsContainer.registerBot("marsik_toy_bot", new MarsikGrammyTelegramBot(XLogger, XDeepseekClient, XRedisClientPool, XEnvironment.getString("BOT_TOKEN_MARSIK")));
        BotsContainer.registerBot("bublik_toy_bot", new BublikGrammyTelegramBot(XLogger, XDeepseekClient, XRedisClientPool, XEnvironment.getString("BOT_TOKEN_BUBLIK")));
        BotsContainer.registerBot("leila_toy_bot", new LeilaGrammyTelegramBot(XLogger, XDeepseekClient, XRedisClientPool, XEnvironment.getString("BOT_TOKEN_LEILA")));
        BotsContainer.registerBot("stasic_toy_bot", new StasicGrammyTelegramBot(XLogger, XDeepseekClient, XRedisClientPool, XEnvironment.getString("BOT_TOKEN_STASIC")));
        BotsContainer.registerBot("kudryashka_toy_bot", new KudryashkaGrammyTelegramBot(XLogger, XDeepseekClient, XRedisClientPool, XEnvironment.getString("BOT_TOKEN_KUDRYASHKA")));
        BotsContainer.registerBot("kvakun_toy_bot", new KvakunGrammyTelegramBot(XLogger, XDeepseekClient, XRedisClientPool, XEnvironment.getString("BOT_TOKEN_KVAKUN")));
        BotsContainer.registerBot("kitsune_toy_bot", new KitsuneGrammyTelegramBot(XLogger, XDeepseekClient, XRedisClientPool, XEnvironment.getString("BOT_TOKEN_KITSUNE")));
        BotsContainer.registerBot("malishka_toy_bot", new MalishkaGrammyTelegramBot(XLogger, XDeepseekClient, XRedisClientPool, XEnvironment.getString("BOT_TOKEN_MALISHKA")));
        BotsContainer.registerBot("mishka_toy_bot", new MishkaGrammyTelegramBot(XLogger, XDeepseekClient, XRedisClientPool, XEnvironment.getString("BOT_TOKEN_MISHKA")));
        BotsContainer.registerBot("lisichka_toy_bot", new LisichkaGrammyTelegramBot(XLogger, XDeepseekClient, XRedisClientPool, XEnvironment.getString("BOT_TOKEN_LISICHKA")));
        BotsContainer.registerBot("zayka_toy_bot", new ZaykaGrammyTelegramBot(XLogger, XDeepseekClient, XRedisClientPool, XEnvironment.getString("BOT_TOKEN_ZAYKA")));


        for(const bot of BotsContainer.getAllBots())
            bot.start();

        const onShutdown = async () => {
            for(const bot of BotsContainer.getAllBots())
                await bot.stop();

            await XRedisClientPool.close();
            await XDatabase.destroy();
            await XEventSystem.stop();
        };

        process.on("SIGINT", onShutdown);
        process.on("SIGTERM", onShutdown);
    } catch (e: any) {
        XLogger.error(e, 'Error while application executing');
    }
})()
