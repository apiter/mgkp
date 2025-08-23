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

}