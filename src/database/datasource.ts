import {DataSource} from "typeorm";
import Environment from "../domain/abstract/Environment";
import TelegramChat from "./entities/TelegramChat";

/**
 * Настройки соединения с базой данных (PostgreSQL)
 */
export default class PostgresDatabase {
    private readonly _datasource: DataSource;

    public constructor(environment: Environment) {
        this._datasource = new DataSource({
            type: "postgres",
            host: environment.getString("POSTGRES_HOST"),
            port: environment.getNumber("POSTGRES_PORT"),
            username: environment.getString("POSTGRES_USER"),
            password: environment.getString("POSTGRES_PASSWORD"),
            database: environment.getString("POSTGRES_DB"),
            logging: true,
            entities: [TelegramChat],
            synchronize: true
        });
    }

    public initialize(): Promise<DataSource> {
        return this._datasource.initialize()
    }
}