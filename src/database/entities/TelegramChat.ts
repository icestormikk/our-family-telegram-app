import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ChatMember} from "@grammyjs/types";

@Entity({ name: "System Telegram Chats" })
export default class TelegramChat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "bigint", unique: true })
    chatId: number;

    @Column({ type: "simple-json", default: [] })
    chatMembers: ChatMember[];

    @Column({ type: "timestamp without time zone", nullable: true })
    lastMessageTime?: Date;
}