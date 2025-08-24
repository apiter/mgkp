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
}