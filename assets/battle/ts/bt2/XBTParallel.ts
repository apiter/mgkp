import XBTComposite from "./XBTComposite";
import { XBTCategory, XBTStatus, XEPolicy } from "./XBTEnum";

export class XBTParallel extends XBTComposite {
    successPolicy: XEPolicy = null

    constructor({
        children: e = [],
        successPolicy: a = XEPolicy.RequireOne
    } = {}) {
        super({
            name: "Parallel", title: "", properties: null,
            children: e
        })
        this.successPolicy = a
    }
    tickRunning(e, a) {
        let n = [];
        if (void 0 !== a && a.length > 0) {
            let u = a.length;
            for (; u--;) {
                let f = a[u],
                    g = this.children[f]._execute(e);
                n[f] = g, g != XBTStatus.RUNNING && a.splice(u, 1)
            }
            0 == a.length && e.blackboard.set("runningChild", void 0, e.tree.id, this.id)
        }
        return n
    }
    tick(data_) {
        let a, n = data_.blackboard.get("runningChild", data_.tree.id, this.id);
        n && (a = n.concat());
        let u = this.tickRunning(data_, n);
        if (u.length > 0 && u.indexOf(XBTStatus.RUNNING) >= 0)
            return XBTStatus.RUNNING;
        let successCnt = 0
        let childLen = this.children.length;
        for (let idx = 0; idx < this.children.length; idx++) {
            if (a && a.indexOf(idx) >= 0) {
                u[idx] == XBTStatus.SUCCESS && successCnt++;
                continue
            }
            let status = this.children[idx]._execute(data_);
            status == XBTStatus.RUNNING && (n ? n.push(idx) : n = [idx], data_.blackboard.set("runningChild", n, data_.tree.id, this.id))
            status == XBTStatus.SUCCESS && successCnt++
        }
        return this.successPolicy == XEPolicy.RequireAll && successCnt == childLen || this.successPolicy == XEPolicy.RequireOne && successCnt > 0 ? XBTStatus.SUCCESS : XBTStatus.FAILURE
    }
}
XBTParallel.register("BTParallel", XBTCategory.COMPOSITE);

