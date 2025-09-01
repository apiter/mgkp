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
    satisfy(data_) {
        let target = data_.target
        let dstPos = this._dstPos || this.takeOut(XPropertiesKey.DESTPOS) || target.getTargetPos();
        if (!dstPos) return false;
        let a = target.getCurPath();
        if (!a || 0 == a.length) {
            let e = target.getOwnerPos();
            a = target.getPath(e, dstPos)
        }
        return !!(a && a.length > 0) && (target.setCurPath(a), !0)
    }
}
XHasPathCdt.register("XHasPathCdt", XBTCategory.CONDITION);


