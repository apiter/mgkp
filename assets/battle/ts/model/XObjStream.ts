import { XObjType } from "../xconfig/XEnum";
import XUtil from "../xutil/XUtil";
import XStream from "./XStream";

export class XObjStream extends XStream {
    mappingInfos: any;
    isMap(t) {
        if (this[t] && this[t] instanceof Map)
            return true;
        return !(!this.mappingInfos || !this.mappingInfos[t] || this.mappingInfos[t][0] != XObjType.Map)
    }
    fromJson(e) {
        let t;
        try {
            t = XUtil.isObject(e) ? e : JSON.parse(e)
        } catch (e) {
            console.log(e)
        }
        if (t) {
            let e = this;
            for (const i in t) {
                let s = t[i];
                if ("_" != i[0] && null != s)
                    if (this.isMap(i)) {
                        let t = new Map;
                        for (const e of s) t.set(e.k, e.v);
                        e[i] = t
                    } else this[i] = s
            }
        }
    }
    toJson(): Record<string, any> {
        const result: Record<string, any> = {};

        for (const key in this) {
            // 忽略私有属性、空值和原型链上的属性
            if (!this.hasOwnProperty(key)) continue;
            if (key[0] === '_' || this[key] == null) continue;

            const value = this[key];

            // Map 转数组 {k, v}
            if (value instanceof Map) {
                const arr: { k: any; v: any }[] = [];
                value.forEach((v, k) => arr.push({ k, v }));
                result[key] = arr;
            }
            // Set 转数组
            else if (value instanceof Set) {
                result[key] = Array.from(value);
            }
            // 普通对象递归
            else if (typeof value === 'object' && !(value instanceof Array)) {
                //@ts-ignore
                if (value.toJson) {
                    //@ts-ignore
                    result[key] = value.toJson();
                } else {
                    result[key] = { ...value };
                }
            }
            // 基本类型或数组
            else {
                result[key] = value;
            }
        }

        return result;
    }
    onNewDay() { }
    onNewGameDay() { }
}


