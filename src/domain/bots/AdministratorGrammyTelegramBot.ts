import GrammyTelegramBot, {GrammyTelegramBotContext} from "../abstract/bots/GrammyTelegramBot";
import Logger from "../../logger/Logger";
import type {ChatMember} from "@grammyjs/types";
import {MemorySessionStorage, NextFunction} from "grammy";
import {chatMembers, ChatMembersFlavor} from "@grammyjs/chat-members";
import TelegramChatService from "../../database/services/TelegramChatService";
import ITelegramChatService from "../../database/services/abstract/ITelegramChatService";
import TelegramChat from "../../database/entities/TelegramChat";

export type AdministratorGrammyTelegramBotContext = GrammyTelegramBotContext & ChatMembersFlavor;

/**
 * Бот-администратор. Своего рода, оркестратор всей деятельности приложения
 */
export default class AdministratorGrammyTelegramBot extends GrammyTelegramBot<AdministratorGrammyTelegramBotContext> {
    private readonly _telegramChatService: ITelegramChatService;

    public constructor(telegramChatService: TelegramChatService, logger: Logger, botToken: string) {
        super(
            "@our_family_admin_bot",
            "Администратор",
            "Агент М-01 — мишка-спецагент и администратор. Он владеет полной информацией о состоянии системы и других персонажах. Говорит кратко, уверенно, иногда использует шпионские формулировки, но остаётся добрым и заботливым.",
            logger,
            botToken
        );

        this._telegramChatService = telegramChatService;

        const adapter = new MemorySessionStorage<ChatMember>();
        this._instance.use(chatMembers(adapter));
        this._instance.on("chat_member", this.onChatMember.bind(this));
    }

    protected onMessage(ctx: AdministratorGrammyTelegramBotContext, next?: NextFunction): void {

    }

    /**
     * Обработчик событий взаимодействия со списком пользователей в чате
     * @param ctx Контекст выполнения
     * @protected
     */
    protected async onChatMember(ctx: AdministratorGrammyTelegramBotContext): Promise<void> {
        const { chatMember, chatId } = ctx;
        if(!chatMember || !chatId)
            return;

        switch (chatMember.new_chat_member.status) {
        case "member": return await this.onMemberAdded(chatId, chatMember.new_chat_member);
        case "left": return await this.onMemberLeft(chatId, chatMember.new_chat_member);
        }
    }

    /**
     * Обработчик события добавления пользователя/бота в чат
     * @param chatId Уникальный идентификатор чата
     * @param chatMember Добавленнный пользователь
     * @protected
     */
    protected async onMemberAdded(chatId: number, chatMember: ChatMember): Promise<void> {
        const chat = await this._telegramChatService.getByChatId(chatId);

        if(!chat) {
            const newChat = new TelegramChat();
            newChat.chatId = chatId;
            newChat.chatMembers = [chatMember];

            await this._telegramChatService.createChat(newChat);
            return;
        }

        chat.chatMembers.push(chatMember);
        await this._telegramChatService.updateChatById(chat.id, chat);
    }

    /**
     * Обработчик события удаления пользователя/бота из чата
     * @param chatId Уникальный идентификатор чата
     * @param chatMember Удалённый из чата пользователь
     * @protected
     */
    protected async onMemberLeft(chatId: number, chatMember: ChatMember): Promise<void> {
        const chat = await this._telegramChatService.getByChatId(chatId);

        if(!chat) {
            this._logger.trace(`Can't remove left member from chat with ${chatId} id. It's not exist in database`);
            return;
        }

        const toRemoveIndex = chat.chatMembers.findIndex((member) => member.user.id == chatMember.user.id);
        if(toRemoveIndex == -1) {
            this._logger.trace(`Can't remove left member from chat with ${chatId} id. No found in chat members list`)
            return;
        }

        chat.chatMembers.splice(toRemoveIndex, 1);

        await this._telegramChatService.updateChatById(chat.id, chat);
    }

    private getChatMemberId(chatMember: ChatMember): string {
        return chatMember.user.username || chatMember.user.id + "";
    }
}