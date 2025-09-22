import XBTAction from "./XBTAction";
import { XBTCategory, XBTStatus } from "./XBTEnum";

export class
    XBTRunner extends XBTAction {
    constructor() {
        super({
            name: "Runner",
            title: "",
            properties: null
        })
    }
    tick(e) {
        return XBTStatus.RUNNING
    }
}
XBTRunner.register("BTRunner", XBTCategory.ACTION);

