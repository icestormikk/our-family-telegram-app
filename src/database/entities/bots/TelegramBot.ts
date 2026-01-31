import {Column, PrimaryGeneratedColumn} from "typeorm";

/**
 * Обший класс для телеграм-ботов в приложении
 */
export default abstract class TelegramBot {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Уникальный идентификатор бота, начинающийся с @
     */
    @Column({ type: "varchar", length: 64, unique: true })
    telegramId: string;

    /**
     * Имя бота
     */
    @Column({ type: "varchar", length: 64, unique: true })
    name: string;

    /**
     * Описание бота
     */
    @Column({ type: "varchar", length: 512 })
    description: string;

    /**
     * Токен бота, полученный от BotFather
     */
    @Column({ type: "varchar", length: 512, default: "" })
    token: string;
}