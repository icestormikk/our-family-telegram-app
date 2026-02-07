import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {User} from "@grammyjs/types";

@Entity({ name: "System Telegram Chats" })
export default class TelegramChat {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column({ type: "bigint", unique: true })
    chatId: number;

    @Column({ type: "simple-json", default: [] })
    chatMembers: User[];

    @Column({ type: "timestamp without time zone", nullable: true })
    lastMessageTime?: Date;

    @Column({ type: "simple-json", default: [] })
    pastEventsIds: string[]
}