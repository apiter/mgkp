import XBTAction from "./XBTAction";
import { XBTCategory, XBTStatus } from "./XBTEnum";

export class XBTFailer extends XBTAction {
    constructor() {
        super({
            name: "Failer", title:"",properties:null
        })
    }
    tick(e) {
        return XBTStatus.FAILURE
    }
}
XBTFailer.register("BTFailer", XBTCategory.ACTION);


