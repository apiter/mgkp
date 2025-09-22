import XBTAction from "./XBTAction";
import { XBTCategory, XBTStatus } from "./XBTEnum";

export class XBTError extends XBTAction {
    constructor() {
        super({
            name: "Error", title: "", properties: null
        })
    }

    tick(t) {
        throw Error("BTError !")
        return XBTStatus.FAILURE
    }
}

XBTError.register("BTError", XBTCategory.ACTION);

