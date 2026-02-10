// shared/utils/MemoryRedis.ts
export class MemoryRedis {
    private store = new Map<string, string>();
    private lists = new Map<string, string[]>();

    async get(key: string): Promise<string | null> {
        return this.store.get(key) || null;
    }

    async setex(key: string, seconds: number, value: string): Promise<string> {
        this.store.set(key, value);
        // Simple output for debug, no actual expiry timer to avoid leaks in this simple mock
        return 'OK';
    }

    async del(key: string): Promise<number> {
        return this.store.delete(key) ? 1 : 0;
    }

    async incr(key: string): Promise<number> {
        const val = parseInt(this.store.get(key) || '0', 10);
        const newVal = val + 1;
        this.store.set(key, newVal.toString());
        return newVal;
    }

    async lpush(key: string, value: string): Promise<number> {
        if (!this.lists.has(key)) {
            this.lists.set(key, []);
        }
        const list = this.lists.get(key)!;
        list.unshift(value);
        return list.length;
    }

    async lrange(key: string, start: number, end: number): Promise<string[]> {
        const list = this.lists.get(key) || [];
        if (end === -1) return list.slice(start);
        return list.slice(start, end + 1);
    }

    async expire(key: string, _seconds: number): Promise<number> {
        const item = this.store.get(key);
        if (!item) return 0;
        // In a real implementation we would set a timeout
        return 1;
    } async keys(pattern: string): Promise<string[]> {
        // Very regex simple matching for *
        const regex = new RegExp(pattern.replace('*', '.*'));
        const keys = [...this.store.keys(), ...this.lists.keys()];
        return keys.filter(k => regex.test(k));
    }
}
