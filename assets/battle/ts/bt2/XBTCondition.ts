import XBTBaseNode from './XBTBaseNode';
import { XBTCategory, XBTStatus } from './XBTEnum';

export class XBTCondition extends XBTBaseNode {
    child = null
    constructor({
        child: e = null,
        name: a = "Condition",
        title: n = "",
        properties: u
    }) {
        super({
            category: XBTCategory.CONDITION,
            name: a,
            title: n,
            properties: u
        })
        this.child = e
    }
    satisfy(data_) {
        return false
    }

    tick(data_) {
        if (data_.blackboard.get("runningChild", data_.tree.id, this.id)) {
            let status = this.child._execute(data_);
            return status != XBTStatus.RUNNING && data_.blackboard.set("runningChild", !1, data_.tree.id, this.id), status
        }
        if (this.satisfy(data_)) {
            if (this.child) {
                let a = this.child._execute(data_);
                return a == XBTStatus.RUNNING && data_.blackboard.set("runningChild", !0, data_.tree.id, this.id), a
            }
            return XBTStatus.SUCCESS
        }
        return XBTStatus.FAILURE
    }
    
    add(t) {
        this.child = t
    }
}

