import XBTBaseNode from "../bt2/XBTBaseNode";
import { XBTCategory, XBTStatus } from "../bt2/XBTEnum";
import { XPlayerScript } from "../view/player/XPlayerScript";

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
    tick(tick_) {
        let playerScript = tick_.target as XPlayerScript;
        let curPath = playerScript.getCurPath();

        if (curPath && curPath.length !== 0) {
            return playerScript.runWithPath(curPath, this.canThrough) ? XBTStatus.FAILURE : XBTStatus.SUCCESS;
        }

        return XBTStatus.FAILURE;
    }

}

XRunAction.register("XRunAction", XBTCategory.ACTION);


