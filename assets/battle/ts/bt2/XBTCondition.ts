import XBTBaseNode from './XBTBaseNode';
import { XBTCategory, XBTStatus } from './XBTEnum';
import XBTTick from './XBTTick';

export class XBTCondition extends XBTBaseNode {
    child: XBTBaseNode = null
    constructor({
        child: child_ = null,
        name: name_ = "Condition",
        title: title_ = "",
        properties: prop_ = null
    }) {
        super({
            category: XBTCategory.CONDITION,
            name: name_,
            title: title_,
            properties: prop_
        })
        this.child = child_
    }
    satisfy(data_) {
        return false
    }

    tick(data_: XBTTick) {
        if (data_.blackboard.get("runningChild", data_.tree.id, this.id)) {
            let status = this.child._execute(data_);
            status != XBTStatus.RUNNING && data_.blackboard.set("runningChild", false, data_.tree.id, this.id)
            return status
        }
        if (this.satisfy(data_)) {
            if (this.child) {
                let status = this.child._execute(data_);
                status == XBTStatus.RUNNING && data_.blackboard.set("runningChild", true, data_.tree.id, this.id)
                return status
            }
            return XBTStatus.SUCCESS
        }
        return XBTStatus.FAILURE
    }

    add(t) {
        this.child = t
    }
}

