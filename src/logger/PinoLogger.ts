import Logger from "./Logger";
import { Logger as pLogger, pino } from "pino";

export default class PinoLogger implements Logger {
    private readonly _instance: pLogger;

    public constructor() {
        this._instance = pino({
            transport: {
                target: 'pino-pretty'
            },
            level: "trace"
        })
    }


    info(message: string): void {
        this._instance.info(message);
    }

    warning(message: string): void {
        this._instance.warn(message);
    }

    error(err: Error, message: string): void {
        this._instance.error(err, message);
    }

    trace(message: string): void {
        this._instance.trace(message);
    }
}