import { XBTCondition } from "../bt2/XBTCondition";
import { XBTCategory } from "../bt2/XBTEnum";
import { XPropertiesKey } from "./XPropertiesKey";

export default class XHasPathCdt extends XBTCondition {
    _dstPos = null

    constructor(dstPos_, t) {
        super({
            name: "XHasPathCdt", title: "", properties: null,
            child: t
        })
        dstPos_ && (this._dstPos = dstPos_.clone())
    }
    satisfy(t) {
        let i = t.target
        let dstPos = this._dstPos || this.takeOut(XPropertiesKey.DESTPOS) || i.getTargetPos();
        if (!dstPos) return false;
        let a = i.getCurPath();
        if (!a || 0 == a.length) {
            let e = i.getOwnerPos();
            a = i.getPath(e, dstPos)
        }
        return !!(a && a.length > 0) && (i.setCurPath(a), !0)
    }
}
XHasPathCdt.register("XHasPathCdt", XBTCategory.CONDITION);


