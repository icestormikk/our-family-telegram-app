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

        const XEventSystem = EventSystem.get(XTelegramChatService, XLogger);

        BotsContainer.registerBot("our_family_admin_bot", new AdministratorGrammyTelegramBot(XTelegramChatService, XLogger, XEnvironment.getString("BOT_TOKEN_ADMINISTRATOR")));
        BotsContainer.registerBot("marsik_toy_bot", new MarsikGrammyTelegramBot(XLogger, XEnvironment.getString("BOT_TOKEN_MARSIK")));
        BotsContainer.registerBot("bublik_toy_bot", new BublikGrammyTelegramBot(XLogger, XEnvironment.getString("BOT_TOKEN_BUBLIK")));

        for(const bot of BotsContainer.getAllBots())
            bot.start();
    } catch (e: any) {
        XLogger.error(e, 'Error while application executing');
    }
})()
