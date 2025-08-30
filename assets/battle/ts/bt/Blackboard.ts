export class Blackboard {
    private data: Map<string, any> = new Map();

    set(key: string, value: any) {
        this.data.set(key, value);
    }

    get<T>(key: string): T | undefined {
        return this.data.get(key);
    }

    has(key: string): boolean {
        return this.data.has(key);
    }

    delete(key: string) {
        this.data.delete(key);
    }
}


