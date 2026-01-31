import TelegramBot from "./TelegramBot";
import {Entity} from "typeorm";

@Entity({ name: "System Telegram Bots" })
export default class GrammyTelegramBot extends TelegramBot {
    protected _instance: string;
}