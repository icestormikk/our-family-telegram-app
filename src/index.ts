import PinoLogger from "./logger/PinoLogger";
import DefaultInteractionSystem from "./domain/interaction/DefaultInteractionSystem";
import MarsikTelegramBot from "./domain/bots/MarsikTelegramBot";

const XLogger = new PinoLogger();

const interactionSystem = new DefaultInteractionSystem(XLogger);

const bot = new MarsikTelegramBot(XLogger, "7857708514:AAH3ci9-xv0RER1JoW1pU3eIVZ_ZqavnafY")
bot.start()