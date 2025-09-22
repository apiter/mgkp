import XBTAction from "./XBTAction";
import { XBTCategory, XBTStatus } from "./XBTEnum";

export class XBTWaitUtil extends XBTAction {
    cdt = null
    child = null
    constructor({
        condition: t = null,
        child: e = null
    } = {}) {
        super({
            name: "WaitUtil",
            title: "WaitUtil <condition>", properties: null
        })
        this.cdt = t
        this.child = e
    }
    tick(e) {
        if (!this.cdt) throw Error("must have condition node !");
        let status = this.cdt._execute(e);
        return status == XBTStatus.SUCCESS ? status : (this.child && this.child._execute(e), XBTStatus.RUNNING)
    }
}
XBTWaitUtil.register("BTWaitUtil", XBTCategory.ACTION);

