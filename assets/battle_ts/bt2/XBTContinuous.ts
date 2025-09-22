import { _decorator, Component, Node } from 'cc';
import XBTAction from './XBTAction';
import { XBTCategory, XBTStatus } from './XBTEnum';
const { ccclass, property } = _decorator;

export default class XBTContinuous extends XBTAction {
    duration = 0
    curFrame = null
    startTime: number = null

    constructor({
        duration: t = 0
    } = {}) {
        super({
            name: "Continuous",
            title: "",
            properties: null
        })
        this.duration = t
    }

    tick(e) {
        let nowTime = (new Date).getTime()
        let tickFrame = e.blackboard.get("tick_frame", e.tree.id);
        null == this.curFrame && (this.curFrame = tickFrame, this.startTime = nowTime)
        tickFrame - this.curFrame > 1 && (this.startTime = nowTime)
        this.curFrame = tickFrame
        return nowTime - this.startTime >= this.duration ? XBTStatus.SUCCESS : XBTStatus.FAILURE

    }
}
XBTContinuous.register("BTContinuous", XBTCategory.ACTION);

