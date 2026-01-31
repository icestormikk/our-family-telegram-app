export default interface Environment {
    get<T>(key: string, receiver: (value: string) => T, defaultValue?: T): T
    getString(key: string, defaultValue?: string): string
    getNumber(key: string, defaultValue?: number): number
}