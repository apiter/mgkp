export class XRandomUtil {
    static seed: number = 0
    static init(seed_: number) {
        this.seed = seed_
    }
    static random() {
        return this.seed = (9301 * this.seed + 49297) % 233280, this.seed / 233280
    }
    static getNumberRandom(min_, max_: number) {
        return this.random() * (max_ - min_) + min_
    }
    static getIntRandom(min_: number, max_: number) {
        return Math.floor(this.random() * (max_ - min_ + 1) + min_)
    }
    static randomArray(arr_) {
        if (!arr_ || 0 == arr_.length) return;
        let len = arr_.length;
        for (; len;) {
            let i = Math.floor(this.random() * len--);
            [arr_[i], arr_[len]] = [arr_[len], arr_[i]]
        }
        return arr_
    }
    static randomInArray<T>(arr_:T[]) {
        if (!arr_ || 0 == arr_.length) return null;
        let rd = Math.floor(this.random() * arr_.length)
        return arr_[rd]
    }

    static randomArrayEx(arr_: any[]) {
        if (!arr_ || 0 == arr_.length)
            return [];
        arr_ = arr_.slice()
        let len = arr_.length;
        for (; len;) {
            let rd = Math.floor(Math.random() * len--);
            [arr_[rd], arr_[len]] = [arr_[len], arr_[rd]]
        }
        return arr_
    }
}


