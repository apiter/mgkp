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
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0; // 生成 0~15 的随机数
            const v = c === 'x' ? r : (r & 0x3 | 0x8); // y 位必须是 8、9、a、b
            return v.toString(16);
        });
    }

    static takeOneByWeight<T extends { weight: number }>(objects: T[]): T | null {
        if (!objects || objects.length === 0) return null;

        // 计算总权重
        let totalWeight = objects.reduce((sum, obj) => sum + (obj.weight > 0 ? obj.weight : 0), 0);
        if (totalWeight <= 0) return null;

        // 随机一个 [0, totalWeight) 的值
        let random = Math.random() * totalWeight;

        // 按权重查找对应的对象
        let cumulative = 0;
        for (let obj of objects) {
            cumulative += obj.weight;
            if (random < cumulative) {
                return obj;
            }
        }

        // 理论上不会走到这里，兜底返回最后一个
        return objects[objects.length - 1];
    }

    static objectToMap<K extends string | number, V>(obj: any): Map<K, V> {
        const map = new Map<K, V>();
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                //@ts-ignore
                map.set(key, obj[key]);
            }
        }
        return map;
    }

    static createUUIDEx(len?: number, rangeLen?: number): string {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        const uuid: string[] = [];
        rangeLen = rangeLen || chars.length; 

        if (len) {
            // 如果传了 len，就生成一个指定长度的随机字符串
            for (let i = 0; i < len; i++) {
                uuid[i] = chars[Math.floor(Math.random() * rangeLen)];
            }
        } else {
            // 否则，生成标准的 UUID 格式
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
            uuid[14] = "4"; // UUID v4 标记位
            for (let i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    const n = Math.floor(Math.random() * 16);
                    uuid[i] = chars[i == 19 ? (n & 0x3) | 0x8 : n];
                }
            }
        }

        return uuid.join("");
    }

}