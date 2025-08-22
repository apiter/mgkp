export default class XUtil {
    static deepClone<T>(arr: T[]): T[] {
        return JSON.parse(JSON.stringify(arr));
    }
}