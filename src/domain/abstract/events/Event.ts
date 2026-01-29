export default abstract class Event {
    private readonly _id: string;

    protected constructor(id: string) {
        this._id = id;
    }

    abstract launch(): Promise<void>

    public getId(): string {
        return this._id;
    }
}