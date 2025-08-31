import XBTComposite from "./XBTComposite";
import { XBTCategory, XBTStatus, XEPolicy } from "./XBTEnum";


export class XBTSequence extends XBTComposite {
    continuePolicy: XBTStatus = null
    successPolicy: XEPolicy = null
    constructor({
        children: e = [],
        continuePolicy: a = XBTStatus.FAILURE,
        successPolicy: n = XEPolicy.RequireOne
    } = {}) {
        super({
            name: "Sequence", title: "", properties: null,
            children: e
        })
        this.continuePolicy = a
        this.successPolicy = n
    }

    open(t) {
        t.blackboard.set("runningChild", 0, t.tree.id, this.id)
    }

    tick(data_) {
        let successCnt = 0,
            n = data_.blackboard.get("runningChild", data_.tree.id, this.id);
        for (let idx = n; idx < this.children.length; idx++) {
            let status = this.children[idx]._execute(data_);
            if (status === XBTStatus.RUNNING) {
                data_.blackboard.set("runningChild", idx, data_.tree.id, this.id)
                return status;
            }
            status == XBTStatus.SUCCESS && successCnt++
            if (status != this.continuePolicy) break
        }
        0 != n && (successCnt += n)
        return this.successPolicy == XEPolicy.RequireOne && successCnt > 0 ||
            this.successPolicy == XEPolicy.RequireAll && successCnt == this.children.length ? XBTStatus.SUCCESS : XBTStatus.FAILURE
    }
}


XBTSequence.register("BTSequence", XBTCategory.COMPOSITE);
