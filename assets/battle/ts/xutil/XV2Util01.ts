import { Node } from "cc";

export class XV2Util01 {
    static isV2Equal(e, t) {
        return e.x == t.x && e.y == t.y
    }
    static isV2InArray(e, t) {
        for (const i of t)
            if (this.isV2Equal(e, i)) return !0;
        return !1
    }
    static pDistance(e, t) {
        let i = e.x - t.x,
            s = e.y - t.y;
        return Math.sqrt(i * i + s * s)
    }
    static pDistanceSquared(e, t) {
        let i = e.x - t.x,
            s = e.y - t.y;
        return i * i + s * s
    }
    static faceTo(node_: Node, x_, y_, offsetR = 0, offsetV) {
        let n = x_ - node_.x,
            r = y_ - node_.y;
        offsetV && (n = x_ - (node_.x + offsetV.x), r = y_ - (node_.y + offsetV.y));
        let o = Math.atan2(r, n),
            l = o * Math.PI / 180;
        node_.angle = -(l + offsetR)
    }
    static faceTo_1(e, t, i, s, a = 0) {
        if (!e || !t) return;
        let n = i - (e.x + t.x),
            r = s - (e.y + t.y),
            o = Math.atan2(r, n),
            l = o * Math.PI / 180;
        t.rotation = l + a
    }
    static faceWith(e, t, i, s = 0) {
        if (!e) return;
        let a = t,
            n = i,
            r = Math.atan2(n, a),
            o = r * Math.PI / 180;
        e.rotation = o + s + 90
    }
}

