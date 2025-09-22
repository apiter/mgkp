export type Unit = "milliseconds" | "seconds" | "minutes" | "hours" | "days" | "months" | "years";

export class XMoment {
    private date: Date;

    constructor(input?: string | number | Date) {
        if (input instanceof Date) {
            this.date = new Date(input.getTime());
        } else if (typeof input === "string" || typeof input === "number") {
            this.date = new Date(input);
        } else {
            this.date = new Date();
        }
    }

    // 格式化
    format(fmt: string): string {
        const pad = (n: number) => n < 10 ? "0" + n : n + "";
        return fmt
            .replace("YYYY", this.date.getFullYear().toString())
            .replace("MM", pad(this.date.getMonth() + 1))
            .replace("DD", pad(this.date.getDate()))
            .replace("HH", pad(this.date.getHours()))
            .replace("mm", pad(this.date.getMinutes()))
            .replace("ss", pad(this.date.getSeconds()));
    }

    // 加
    add(amount: number, unit: Unit): XMoment {
        const d = new Date(this.date);
        switch (unit) {
            case "milliseconds": d.setMilliseconds(d.getMilliseconds() + amount); break;
            case "seconds": d.setSeconds(d.getSeconds() + amount); break;
            case "minutes": d.setMinutes(d.getMinutes() + amount); break;
            case "hours": d.setHours(d.getHours() + amount); break;
            case "days": d.setDate(d.getDate() + amount); break;
            case "months": d.setMonth(d.getMonth() + amount); break;
            case "years": d.setFullYear(d.getFullYear() + amount); break;
        }
        return new XMoment(d);
    }

    // 减
    subtract(amount: number, unit: Unit): XMoment {
        return this.add(-amount, unit);
    }

    // 差值
    diff(other: XMoment, unit: Unit = "milliseconds"): number {
        const diffMs = this.date.getTime() - other.date.getTime();
        switch (unit) {
            case "seconds": return diffMs / 1000;
            case "minutes": return diffMs / (1000 * 60);
            case "hours": return diffMs / (1000 * 60 * 60);
            case "days": return diffMs / (1000 * 60 * 60 * 24);
            case "months": return (this.date.getFullYear() - other.date.getFullYear()) * 12 +
                (this.date.getMonth() - other.date.getMonth());
            case "years": return this.date.getFullYear() - other.date.getFullYear();
            default: return diffMs;
        }
    }

    // 相对时间
    fromNow(): string {
        const now = new Date();
        const diffSec = Math.floor((this.date.getTime() - now.getTime()) / 1000);
        if (diffSec > 0) {
            if (diffSec < 60) return `${diffSec} 秒后`;
            if (diffSec < 3600) return `${Math.floor(diffSec / 60)} 分钟后`;
            if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} 小时后`;
            return `${Math.floor(diffSec / 86400)} 天后`;
        } else {
            const abs = Math.abs(diffSec);
            if (abs < 60) return `${abs} 秒前`;
            if (abs < 3600) return `${Math.floor(abs / 60)} 分钟前`;
            if (abs < 86400) return `${Math.floor(abs / 3600)} 小时前`;
            return `${Math.floor(abs / 86400)} 天前`;
        }
    }

    // 是否在另一个时间之后
    isAfter(other: XMoment, unit: Unit = "milliseconds"): boolean {
        return this.diff(other, unit) > 0;
    }

    // 是否在另一个时间之前
    isBefore(other: XMoment, unit: Unit = "milliseconds"): boolean {
        return this.diff(other, unit) < 0;
    }

    // 获取 JS 原生 Date
    toDate(): Date {
        return new Date(this.date);
    }
}

// 工厂函数
export function moment(input?: string | number | Date): XMoment {
    return new XMoment(input);
}
