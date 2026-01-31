import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ name: "System Telegram Chats" })
export default class TelegramChat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "bigint", unique: true })
    chatId: number;
}