import { log } from "cc";
import XBTComposite from "./XBTComposite";
import { XBTCategory, XBTStatus, XEPolicy } from "./XBTEnum";


export class XBTSequence extends XBTComposite {
    _continuePolicy: XBTStatus = null
    _successPolicy: XEPolicy = null
    constructor({
        children: children_ = [],
        title: _title = "",
        continuePolicy: continuePolicy_ = XBTStatus.FAILURE,
        successPolicy: successPolicy_ = XEPolicy.RequireOne
    } = {}) {
        super({
            name: "Sequence", title: _title, properties: null,
            children: children_
        })
        this._continuePolicy = continuePolicy_
        this._successPolicy = successPolicy_
    }

    open(t) {
        t.blackboard.set("runningChild", 0, t.tree.id, this.id)
    }

    tick(data_) {
        let runningIdx = data_.blackboard.get("runningChild", data_.tree.id, this.id);
        let successCnt = runningIdx
        for (let idx = runningIdx; idx < this.children.length; idx++) {
            let status = this.children[idx]._execute(data_);
            if (status === XBTStatus.RUNNING) {
                data_.blackboard.set("runningChild", idx, data_.tree.id, this.id)
                return status;
            }
            status == XBTStatus.SUCCESS && successCnt++
            if (status != this._continuePolicy)
                break
        }
        let ret = this._successPolicy == XEPolicy.RequireOne && successCnt > 0 || this._successPolicy == XEPolicy.RequireAll && successCnt == this.children.length
        // console.log(`XBTSequence[${this.id}][${this.title}] 执行结果:${ret}`)
        return ret ? XBTStatus.SUCCESS : XBTStatus.FAILURE
    }
}


XBTSequence.register("BTSequence", XBTCategory.COMPOSITE);
