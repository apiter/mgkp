import { XBTCondition } from "../bt2/XBTCondition";
import { XBTCategory } from "../bt2/XBTEnum";

export default class XNotInStopRangeCdt extends XBTCondition {
    range = null
    constructor(rang_, child_) {
        super({
            name: "XNotInStopRangeCdt", title: "", properties: null,
            child: child_
        })
        this.range = rang_
    }
    satisfy(e) {
        let t = e.target,
            i = t.getOwnerPos(),
            s = t.getTargetPos(t.getCurTarget()),
            a = t.getCurTarget();
        return !(!i || !s) && !(i.distance(s) <= this.range && t.targetIsOK(a))
    }
}
XNotInStopRangeCdt.register("XNotInStopRangeCdt", XBTCategory.CONDITION);
