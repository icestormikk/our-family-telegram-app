import Environment from "../abstract/Environment";
import {loadEnvFile} from "node:process";
import EnvironmentError from "../errors/EnvironmentError";

export default class ProcessEnvironment implements Environment {
    get<T>(key: string, receiver: (value: string) => T, defaultValue?: T): T {
        const value = process.env[key];

        if(value !== undefined)
            return receiver(value);

        if(defaultValue !== undefined)
            return defaultValue;

        throw new EnvironmentError(key);
    }

    getString(key: string, defaultValue?: string): string {
        return this.get(key, (value) => value, defaultValue);
    }

    getNumber(key: string, defaultValue?: number): number {
        return this.get(key, (value) => Number(value), defaultValue);
    }
}