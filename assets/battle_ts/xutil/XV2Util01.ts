import { misc, Node } from "cc";

export class XV2Util01 {
    static isV2Equal(e, t) {
        return e.x == t.x && e.y == t.y
    }
    static isV2InArray(src, arr) {
        for (const ele of arr)
            if (this.isV2Equal(src, ele)) return true;
        return !1
    }
    static pDistance(v1, v2) {
        let i = v1.x - v2.x,
            s = v1.y - v2.y;
        return Math.sqrt(i * i + s * s)
    }
    static pDistanceSquared(v1, v2) {
        let x = v1.x - v2.x,
            y = v1.y - v2.y;
        return x * x + y * y
    }

    /**
     * 让节点面向指定的世界坐标点
     * @param node 需要旋转的节点
     * @param x 目标点的 x（世界坐标）
     * @param y 目标点的 y（世界坐标）
     */
    static faceToCC(node: Node, x: number, y: number, offsetAngle: number = 0) {
        // 获取节点的世界坐标
        const worldPos = node.worldPosition;

        // 计算方向向量
        const dx = x - worldPos.x;
        const dy = y - worldPos.y;

        // atan2 返回的是弧度，转换成角度
        const rad = Math.atan2(dy, dx);
        const deg = misc.radiansToDegrees(rad);

        // 设置旋转角度，注意 Cocos angle 是逆时针
        node.angle = (deg) + offsetAngle;
    }
}

