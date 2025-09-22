import XBTAction from '../bt2/XBTAction';
import { XBTCategory, XBTStatus } from '../bt2/XBTEnum';

export default class XIdleAction extends XBTAction {
    _aniName = ""
    constructor(aniName_) {
        super({
            name: "IdleNode",
            title: "idle",
            properties:null
        })
        this._aniName = aniName_
    }
    open(e) {
        e.target.playAnim(this._aniName)
    }
    tick(tick_) {
        tick_.target;
        return XBTStatus.SUCCESS
    }
}
XIdleAction.register("IdleNode", XBTCategory.ACTION);

