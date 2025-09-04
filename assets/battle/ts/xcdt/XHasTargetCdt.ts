import { debug, log } from "cc";
import { XBTCondition } from "../bt2/XBTCondition";
import { XBTCategory } from "../bt2/XBTEnum";
import { XBuildingScript } from "../view/building/XBuildingScript";
import { XPlayerScript } from "../view/player/XPlayerScript";
import XBuildingModel from "../model/XBuildingModel";

export default class XHasTargetCdt extends XBTCondition {
    constructor(child_ = null) {
        super({
            name: "XHasTargetCdt", title: "", properties: null,
            child: child_
        })
    }
    satisfy(e) {
        let player = e.target as XPlayerScript
        let curTarget = player.getCurTarget() as XBuildingModel;
        if (curTarget?.owner.isValid && player.targetIsOK(curTarget)) {
            // curTarget 正常，不做处理
        } else {
            player.setCurTarget(null);
            curTarget = null;
        }
        let ret = !!curTarget
        // log(`XHasTargetCdt ret:${ret}`)
        return ret
    }
}
XHasTargetCdt.register("XHasTargetCdt", XBTCategory.CONDITION);

