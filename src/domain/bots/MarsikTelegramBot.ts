import GrammyTelegramBot from "../abstract/bots/GrammyTelegramBot";
import Logger from "../../logger/Logger";

/**
 * Бот "Марсик"
 */
export default class MarsikTelegramBot extends GrammyTelegramBot {
    public constructor(logger: Logger, botToken: string) {
        super("@marsik_toy_bot","Марсик", "Марсик — котёнок в костюме мишки с галстуком-бабочкой, вежливый и немного застенчивый. Он старается быть правильным и поддерживать порядок в компании. Часто смущается, но всегда говорит от чистого сердца.", logger, botToken);
    }
}