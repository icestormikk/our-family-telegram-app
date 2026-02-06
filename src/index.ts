import "reflect-metadata";
import PinoLogger from "./logger/PinoLogger";
import ProcessEnvironment from "./domain/environment/ProcessEnvironment";
import Logger from "./logger/Logger";
import Environment from "./domain/abstract/Environment";
import DefaultCrypto from "./domain/crypto/DefaultCrypto";
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
import {createClient, RedisClientType} from "redis";

(async function() {
    const XLogger: Logger = new PinoLogger();
    const XEnvironment: Environment = new ProcessEnvironment(".env");
    const XCrypto = new DefaultCrypto(XEnvironment.getString("SECRET_KEY"));

    try {
        XLogger.trace("Initializing database..")
        const XDatabase = await new PostgresDatabase(XEnvironment).initialize();
        XLogger.trace("Initialization of database ended successfully");

        const XTelegramChatRepository = new TelegramChatRepository(XDatabase);
        const XTelegramChatService = new TelegramChatService(XTelegramChatRepository);

        const XDeepseekClient = new DeepseekClient(XEnvironment.getString("DEEPSEEK_API_KEY"));

        const XRedisClient: RedisClientType = createClient({ url: XEnvironment.getString("REDIS_URL") });
        XRedisClient.on("error", (e) => XLogger.error(e, "Redis Client error"))
        await XRedisClient.connect();

        await EventSystem.init(XTelegramChatService, XLogger, XRedisClient, XDeepseekClient).start();

        BotsContainer.registerBot("our_family_admin_bot", new AdministratorGrammyTelegramBot(XTelegramChatService, XLogger, XDeepseekClient, XRedisClient, XEnvironment.getString("BOT_TOKEN_ADMINISTRATOR")));
        BotsContainer.registerBot("marsik_toy_bot", new MarsikGrammyTelegramBot(XLogger, XDeepseekClient, XRedisClient, XEnvironment.getString("BOT_TOKEN_MARSIK")));
        BotsContainer.registerBot("bublik_toy_bot", new BublikGrammyTelegramBot(XLogger, XDeepseekClient, XRedisClient, XEnvironment.getString("BOT_TOKEN_BUBLIK")));
        BotsContainer.registerBot("leila_toy_bot", new LeilaGrammyTelegramBot(XLogger, XDeepseekClient, XRedisClient, XEnvironment.getString("BOT_TOKEN_LEILA")));

        for(const bot of BotsContainer.getAllBots())
            bot.start();
    } catch (e: any) {
        XLogger.error(e, 'Error while application executing');
    }
})()
