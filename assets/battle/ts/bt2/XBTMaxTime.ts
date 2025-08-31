import XBTDecorator from "./XBTDecorator";
import { XBTCategory, XBTStatus } from "./XBTEnum";

export class XBTMaxTime extends XBTDecorator {
    maxTime = 0
    constructor({
        maxTime: t = 0,
        child: e = null
    } = {}) {
        super({
            child: e,
            name: "MaxTime",
            title: "Max <maxTime>ms",
            properties: {
                maxTime: 0
            }
        })
        if (!t) throw "maxTime parameter in MaxTime decorator is an obligatory parameter";
        this.maxTime = t
    }
    open(t) {
        let e = (new Date).getTime();
        t.blackboard.set("startTime", e, t.tree.id, this.id)
    }
    tick(e) {
        if (!this.child) throw Error("BTStatus no child !");
        let a = (new Date).getTime(),
            n = e.blackboard.get("startTime", e.tree.id, this.id),
            u = this.child._execute(e);
        return a - n > this.maxTime ? XBTStatus.FAILURE : u
    }
}
XBTMaxTime.register("BTMaxTime", XBTCategory.DECORATOR);

