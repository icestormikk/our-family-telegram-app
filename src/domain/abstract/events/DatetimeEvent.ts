import Event from './Event'
import TelegramChat from "../../../database/entities/TelegramChat";
import Logger from "../../../logger/Logger";
import EventError from "../../errors/EventError";

export default abstract class DatetimeEvent extends Event {
    private readonly _start: Date;
    private readonly _end: Date;

    protected constructor(id: string, start: Date, end: Date, logger: Logger) {
        if(start > end)
            throw new Error(`Datetime event initialization error: start(${start.toLocaleString()}) later than end(${end.toLocaleString()})`);

        super(id, logger);

        this._start = start;
        this._end = end;
    }

    launch(chat: TelegramChat): Promise<void> {
        const now = new Date();
        if(now >= this._start && now <= this._end)
            return super.launch(chat);

        throw new EventError(`No suitable time for ${this._id} event: start(${this._start}), now(${now}), end(${this._end})`);
    }
}