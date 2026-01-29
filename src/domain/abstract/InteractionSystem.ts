import TelegramBot from "./bots/TelegramBot";
import Event from "./events/Event";

/**
 * Абстрактный класс, объединяющий набор методов и свойств для построения системы взаимодействия внутри чата
 */
export default interface InteractionSystem {
    /**
     * Разговор двух телеграм-ботов
     * @param who Телеграм-бот, служащий инициатором разговора
     * @param whom Телеграм-бот, к которому обращается бот, переданный в параметре {@link who}
     */
    speak(who: TelegramBot, whom: TelegramBot): Promise<void>

    /**
     * Разговор/реплика телеграм-бота в чате
     * @param who Телеграм-бот, который является автором реплики
     */
    speak(who: TelegramBot): Promise<void>

    /**
     * Запуск какого-либо события в чате
     * @param event
     */
    startEvent(event: Event): Promise<void>
}