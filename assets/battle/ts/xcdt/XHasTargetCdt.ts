import { XBTCondition } from "../bt2/XBTCondition";
import { XBTCategory } from "../bt2/XBTEnum";

export default class XHasTargetCdt extends XBTCondition {
    constructor(e) {
        super({
            name: "XHasTargetCdt", title: "", properties: null,
            child: e
        })
    }
    satisfy(e) {
        let t = e.target,
            i = t.getCurTarget();
        return !i || i.owner && !i.owner.destroyed && t.targetIsOK(i) || (t.setCurTarget(null), i = null), !!i
    }
}
XHasTargetCdt.register("XHasTargetCdt", XBTCategory.CONDITION);

