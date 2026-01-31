import "reflect-metadata";
import PinoLogger from "./logger/PinoLogger";
import ProcessEnvironment from "./domain/environment/ProcessEnvironment";
import Logger from "./logger/Logger";
import Environment from "./domain/abstract/Environment";
import DefaultCrypto from "./domain/crypto/DefaultCrypto";
import GrammyTelegramBot from "./database/entities/bots/GrammyTelegramBot";
import PostgresDatabase from "./database/datasource";
import GrammyTelegramBotRepository from "./database/repositories/GrammyTelegramBotRepository";
import GrammyTelegramBotService from "./database/services/GrammyTelegramBotService";
import TelegramChatRepository from "./database/repositories/TelegramChatRepository";
import TelegramChatService from "./database/services/TelegramChatService";

function createBot(telegramId: string, name: string, description: string, token: string): GrammyTelegramBot {
    const bot = new GrammyTelegramBot();

    bot.telegramId = telegramId;
    bot.name = name;
    bot.description = description;
    bot.token = token;

    return bot;
}

const XEnvironment: Environment = new ProcessEnvironment(".env");
const XCrypto = new DefaultCrypto(XEnvironment.getString("SECRET_KEY"));

const Marsik = createBot(
    "@marsik_toy_bot",
    "Марсик",
    "Марсик — котёнок в костюме мишки с галстуком-бабочкой, вежливый и немного застенчивый. Он старается быть правильным и поддерживать порядок в компании. Часто смущается, но всегда говорит от чистого сердца.",
    XEnvironment.getString("BOT_KEY_MARSIK")
);

const Bublik = createBot(
    "@bublik_toy_bot",
    "Бублик",
    "Бублик — круглый белый котик, который всегда держит авокадо и никому его не отдаёт. Он слегка упрямый и самодовольный, но это выглядит смешно и мило. Часто шутит про своё авокадо и относится к нему как к сокровищу.",
    XEnvironment.getString("BOT_KEY_BUBLIK")
);


(async function() {
    const XLogger: Logger = new PinoLogger();

    try {
        XLogger.trace("Initializing database..")
        const XDatabase = await new PostgresDatabase(XEnvironment).initialize();
        XLogger.trace("Initialization of database ended successfully");

        const XGrammyTelegramBotRepository = new GrammyTelegramBotRepository(XDatabase, XCrypto);
        const XGrammyTelegramBotService = new GrammyTelegramBotService(XGrammyTelegramBotRepository);

        const XTelegramChatRepository = new TelegramChatRepository(XDatabase);
        const XTelegramChatService = new TelegramChatService(XTelegramChatRepository);

        // TODO added "admin" bot to control it?
        for(const bot of [Marsik, Bublik]) {
            try {
                await XGrammyTelegramBotService.createBot(bot);
            } catch (e) {}
        }
    } catch (e: any) {
        XLogger.error(e, 'Error while application executing');
    }
})()
