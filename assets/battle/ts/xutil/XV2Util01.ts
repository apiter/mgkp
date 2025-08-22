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
    static pDistance(v1, v2) {
        let i = v1.x - v2.x,
            s = v1.y - v2.y;
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
    static faceTo_1(node_, img_, targetX_, targetY_, offsetR_ = 0) {
        if (!node_ || !img_) return;
        let x = targetX_ - (node_.x + img_.x),
            y = targetY_ - (node_.y + img_.y),
            o = Math.atan2(y, x),
            l = o * Math.PI / 180;
        img_.angle = -(l + offsetR_)
    }
    static faceWith(e, x_, y_, s = 0) {
        if (!e) return;
        let a = x_,
            n = y_,
            r = Math.atan2(n, a),
            o = r * Math.PI / 180;
        e.angle = o + s + 90
    }
}

