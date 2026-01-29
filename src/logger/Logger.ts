export default interface Logger {
    info(message: string): void;
    warning(message: string): void;
    error(err: Error, message: string): void;
    trace(message: string): void;
}