import TelegramBot from "../../entities/bots/TelegramBot";
import GrammyTelegramBot from "../../entities/bots/GrammyTelegramBot";

export default interface IGrammyTelegramBotService {
    getByTelegramId(telegramId: string): Promise<GrammyTelegramBot>
    createBot(bot: GrammyTelegramBot): Promise<GrammyTelegramBot>
}