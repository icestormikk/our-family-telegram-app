import {OpenAI} from "openai";
import TelegramBot from "./abstract/bots/TelegramBot";

export default class DeepseekClient {
    private readonly _client: OpenAI;

    public constructor(apiKey: string) {
        this._client = new OpenAI({ baseURL: "https://api.deepseek.com", apiKey: apiKey });
    }

    public async startConversation(who: TelegramBot, whom: TelegramBot): Promise<string> {
        const response = await this._client.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: who.description },
                { role: "user", content: `Ты начинаешь разговор с другом ${whom.name} (описание: "${whom.description}"). Заведи разговор, основываясь на его интересах. 1 реплика, до 24 слов, общение не официальное. При обращении используй не имя, а "${whom.username}"` }
            ]
        });

        return response.choices[0].message.content || "";
    }

    public async replyToMessage(receiver: TelegramBot, message: string): Promise<string> {
        const response = await this._client.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: receiver.description },
                { role: "user", content: `Ты получил в чате сообщение от друга: "${message}". Ответь на него так, как ответил бы ТЫ, исходя из своего характера, веди не официальную беседу. 1 реплика, до 24 слов.` }
            ]
        })

        return response.choices[0].message.content || "";
    }
}