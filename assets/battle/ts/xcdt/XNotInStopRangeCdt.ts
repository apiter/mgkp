import { v2, Vec2, Vec3 } from "cc";
import { XBTCondition } from "../bt2/XBTCondition";
import { XBTCategory } from "../bt2/XBTEnum";
import { XPlayerScript } from "../view/player/XPlayerScript";

export default class XNotInStopRangeCdt extends XBTCondition {
    range = null
    constructor(range_, child_ = null) {
        super({
            name: "XNotInStopRangeCdt", title: "", properties: null,
            child: child_
        })
        this.range = range_
    }
    satisfy(e) {
        let playerScript = e.target as XPlayerScript
        let ownPos = playerScript.getOwnerPos()
        let targetPos = playerScript.getTargetPos(playerScript.getCurTarget())
        let curTarge = playerScript.getCurTarget();
        if (!ownPos || !targetPos) return false;

        const isInRange = Vec2.distance(v2(ownPos.x, ownPos.y), targetPos) <= this.range;
        const isTargetOK = playerScript.targetIsOK(curTarge);

        return !(isInRange && isTargetOK);
    }
}
XNotInStopRangeCdt.register("XNotInStopRangeCdt", XBTCategory.CONDITION);
