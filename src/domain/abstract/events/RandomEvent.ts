import Event from "./Event";
import EventError from "../../errors/EventError";
import Logger from "../../../logger/Logger";

export default abstract class RandomEvent extends Event {
    private readonly _launchProbability: number;

    protected constructor(id: string, logger: Logger, launchProbability: number) {
        super(id, logger);

        if(launchProbability < 0 || launchProbability > 1)
            throw new EventError(`launchProbability must be > 0 and < 1, but got ${launchProbability}`);

        this._launchProbability = launchProbability;
    }

    public launch(): Promise<void> {
        const probability = Math.random();
        if(probability < this._launchProbability)
            return super.launch();

        return Promise.reject("Probability failed");
    }

    public getLaunchProbability(): number {
        return this._launchProbability;
    }
}

