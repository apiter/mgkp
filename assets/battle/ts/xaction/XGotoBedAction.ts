import XBTAction from "../bt2/XBTAction";
import { XBTCategory, XBTStatus } from "../bt2/XBTEnum";
import XMgr from "../XMgr";

export class XGotoBedAction extends XBTAction {
    static NAME = "XGotoBedAction"
    constructor() {
        super({
            name: XGotoBedAction.NAME, title: "", properties: null
        })
    }
    tick(data_) {
        let target = data_.target
        let curTarget = target.getCurTarget();
        if (!curTarget) return XBTStatus.FAILURE;
        let a = XMgr.mapMgr.mapPosToGridPos(curTarget.owner.x, curTarget.owner.y);
        return target.gotoBed(a.x, a.y) ? XBTStatus.SUCCESS : XBTStatus.FAILURE
    }
}
XGotoBedAction.register(XGotoBedAction.NAME, XBTCategory.ACTION);

