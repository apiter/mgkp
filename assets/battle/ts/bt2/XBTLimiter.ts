import XBTDecorator from './XBTDecorator';
import { XBTCategory, XBTStatus } from './XBTEnum';

export class XBTLimiter extends XBTDecorator {
    child = null
    maxLoop = 0
    constructor({
        child: t = null,
        maxLoop: e = 0
    } = {}) {
        super({
            child: t,
            name: "Limiter",
            title: "Limit <maxLoop> Activations",
            properties: {
                maxLoop: 1
            }
        })
        if (!e) throw "maxLoop parameter in Limiter decorator is an obligatory parameter";
        this.maxLoop = e
    }
    open(t) {
        t.blackboard.set("i", 0, t.tree.id, this.id)
    }
    tick(e) {
        if (!this.child) throw Error("BTLimiter no child !");
        let a = e.blackboard.get("i", e.tree.id, this.id);
        if (a < this.maxLoop) {
            let status = this.child._execute(e);
            status != XBTStatus.SUCCESS && status != XBTStatus.FAILURE || e.blackboard.set("i", a + 1, e.tree.id, this.id)
            return status
        }
        return XBTStatus.FAILURE
    }
}
XBTLimiter.register("BTLimiter", XBTCategory.DECORATOR);

