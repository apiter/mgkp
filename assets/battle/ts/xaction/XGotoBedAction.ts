import XBTAction from "../bt2/XBTAction";
import { XBTCategory, XBTStatus } from "../bt2/XBTEnum";
import { XPlayerScript } from "../view/player/XPlayerScript";
import XMgr from "../XMgr";

export class XGotoBedAction extends XBTAction {
    static NAME = "XGotoBedAction"
    constructor() {
        super({
            name: XGotoBedAction.NAME, title: "", properties: null
        })
    }
    tick(data_) {
        let target = data_.target as XPlayerScript
        let curTarget = target.getCurTarget();
        if (!curTarget) return XBTStatus.FAILURE;
        let grid = XMgr.mapMgr.mapPosToGridPos(curTarget.owner.x, curTarget.owner.y);
        return target.gotoBed(grid.x, grid.y) ? XBTStatus.SUCCESS : XBTStatus.FAILURE
    }
}
XGotoBedAction.register(XGotoBedAction.NAME, XBTCategory.ACTION);

