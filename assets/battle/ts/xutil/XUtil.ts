export default class XUtil {
    static deepClone<T>(arr: T[]): T[] {
        return JSON.parse(JSON.stringify(arr));
    }

    static isNumber(obj) {
        return typeof obj === 'number';
    }

    static isObject(obj: any): obj is object {
        return obj !== null && typeof obj === 'object';
    }

    static createUUID(): string {
        // 返回一个类似 "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx" 的 UUID
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0; // 生成 0~15 的随机数
            const v = c === 'x' ? r : (r & 0x3 | 0x8); // y 位必须是 8、9、a、b
            return v.toString(16);
        });
    }
    
}