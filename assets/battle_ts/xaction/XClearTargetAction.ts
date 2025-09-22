import XBTAction from '../bt2/XBTAction';
import { XBTCategory, XBTStatus } from '../bt2/XBTEnum';
import { XPlayerScript } from '../view/player/XPlayerScript';

export class XClearTargetAction extends XBTAction {
    static NAME = "XClearTargetAction"
    constructor() {
        super({
            name: XClearTargetAction.NAME
        })
    }
    
    tick(tick_) {
        let target = tick_.target as XPlayerScript;
        target.setEscape(false), 
        target.setCurTarget(null)
        return XBTStatus.SUCCESS
    }
}



XClearTargetAction.register(XClearTargetAction.NAME, XBTCategory.ACTION)