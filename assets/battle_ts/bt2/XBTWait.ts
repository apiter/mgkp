import XBTAction from "./XBTAction";
import { XBTCategory, XBTStatus } from "./XBTEnum";

export class XBTWait extends XBTAction {
    endTime = null
    constructor({
        milliseconds: t = 0
    } = {}) {
        super({
            name: "Wait",
            title: "Wait <milliseconds>ms",
            properties: {
                milliseconds: 0
            }
        })
        this.endTime = t
    }
    open(t) {
        let nowTime = (new Date).getTime();
        t.blackboard.set("startTime", nowTime, t.tree.id, this.id)
    }

    tick(data) {
        return (new Date).getTime() - data.blackboard.get("startTime", data.tree.id, this.id) > this.endTime ? XBTStatus.SUCCESS : XBTStatus.RUNNING
    }
}
XBTWait.register("BTWait", XBTCategory.ACTION);


