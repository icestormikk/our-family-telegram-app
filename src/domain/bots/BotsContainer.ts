import TelegramBot from "../abstract/bots/TelegramBot";

export default class BotsContainer {
    private static readonly Bots: Record<string, TelegramBot> = {}

    public static registerBot(key: string, bot: TelegramBot): void {
        this.Bots[key] = bot;
    }

    public static getBot(key: string): TelegramBot|undefined {
        return this.Bots[key];
    }

    public static getAllBots(): TelegramBot[] {
        return Object.values(this.Bots);
    }
}