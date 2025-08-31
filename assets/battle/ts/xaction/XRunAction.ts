import XBTBaseNode from "../bt2/XBTBaseNode";
import { XBTCategory, XBTStatus } from "../bt2/XBTEnum";

export default class XRunAction extends XBTBaseNode {
    canThrough = false
    aniName = ""
    constructor(aniName_, canThrough_) {
        super({ name: "XRunAction", title: "", properties: null })
        this.aniName = aniName_
        this.canThrough = canThrough_
    }
    open(e) {
        e.target.playAnim(this.aniName)
    }
    tick(e) {
        let t = e.target;
        let i = t.getCurPath();

        if (i && i.length !== 0) {
            return t.runWithPath(i, this.canThrough) ? XBTStatus.FAILURE : XBTStatus.SUCCESS;
        }

        return XBTStatus.FAILURE;
    }

}

XRunAction.register("XRunAction", XBTCategory.ACTION);


