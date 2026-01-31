/**
 * Ошибка, возникшая при работе с переменным окружения
 */
export default class EnvironmentError extends Error {
    /**
     * Конструктор новой ошибки окружения
     * @param key Идентификатор переменной окружения, с которой возникла ошибка
     */
    public constructor(key: string) {
        super(`Environment variable ${key} is undefined!`);
    }
}