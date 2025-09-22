import XBTDecorator from "./XBTDecorator";
import { XBTCategory, XBTStatus } from "./XBTEnum";


export class XBTInverter extends XBTDecorator {
    constructor({
        child: t = null
    } = {}) {
        super({
            child: t,
            name: "Inverter"
        })
    }
    tick(e) {
        if (!this.child) throw Error("BTInverter no child !");
        let a = this.child._execute(e);
        return a == XBTStatus.SUCCESS ? a = XBTStatus.FAILURE : a == XBTStatus.FAILURE && (a = XBTStatus.SUCCESS), a
    }
}
XBTInverter.register("BTInverter", XBTCategory.DECORATOR);


