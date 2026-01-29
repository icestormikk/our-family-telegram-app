import Event from "../abstract/Event";
import EventError from "../errors/EventError";

export default abstract class RandomEvent extends Event {
    private readonly _launchProbability: number;

    protected constructor(id: string, launchProbability: number) {
        super(id);
        if(launchProbability < 0 || launchProbability > 1)
            throw new EventError("");
        this._launchProbability = launchProbability;
    }
}

