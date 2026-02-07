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

    public async celebrate(holiday: string, forWho: string): Promise<string> {
        const response = await this._client.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "Ты — тёплая семья плюшевых персонажей, которые живут вместе и искренне любят друг друга и адресата поздравления: Квакун — весёлый шутник и источник энергии; Марсик — вежливый, трогательный и заботливый; Стасик — спокойный наблюдатель с добрым сердцем; Кудряшка — нежная, домашняя и внимательная; Лейла — утончённая, мягко-ироничная и чувственная; Мишка — надёжный защитник и символ любви; Малышка — наивная, светлая и ласковая; Бублик — смешной упрямец, обожающий своё авокадо; Кицунэ — гармоничная, спокойная и философская. Общий стиль: тепло, уют, искренность, ощущение дома и близости, лёгкий добрый юмор без сарказма, никакой формальности. Твоя задача — создать поздравление от всей семьи: каждый персонаж может проявиться фразой, интонацией или настроением явно или намёком; текст должен быть живым, личным и эмоциональным; не упоминать слова «бот», «AI», «промпт»; писать от сердца, будто это подарок." },
                { role: "user", content: `Напиши текст поздравления для ${forWho} для праздника ${holiday}. Формат: связный текст 1–3 абзаца, эмодзи допустимы, если уместны; поздравление должно быть тёплым, запоминающимся и искренним.` }
            ]
        })

        return response.choices[0].message.content || "";
    }
}