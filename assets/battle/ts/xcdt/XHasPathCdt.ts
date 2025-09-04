import { XBTCondition } from "../bt2/XBTCondition";
import { XBTCategory } from "../bt2/XBTEnum";
import { XPlayerScript } from "../view/player/XPlayerScript";
import { XPropertiesKey } from "./XPropertiesKey";

export default class XHasPathCdt extends XBTCondition {
    _dstPos = null

    constructor(dstPos_ = null, child_ = null) {
        super({
            name: "XHasPathCdt", title: "", properties: null,
            child: child_
        })
        dstPos_ && (this._dstPos = dstPos_.clone())
    }
    satisfy(data_) {
        let target = data_.target
        let dstPos = this._dstPos || this.takeOut(XPropertiesKey.DESTPOS) || target.getTargetPos();
        if (!dstPos) return false;
        let path = target.getCurPath();
        if (!path || 0 == path.length) {
            let e = target.getOwnerPos();
            path = target.getPath(e, dstPos)
        }
        return !!(path && path.length > 0) && (target.setCurPath(path), !0)
    }
}
XHasPathCdt.register("XHasPathCdt", XBTCategory.CONDITION);


