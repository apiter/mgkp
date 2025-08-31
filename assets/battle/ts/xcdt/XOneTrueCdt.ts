import { XBTCondition } from "../bt2/XBTCondition";
import { XBTStatus } from "../bt2/XBTEnum";

export class XOneTrueCdt extends XBTCondition {
    arrCdts: XBTCondition[] = []
    constructor(...e) {
        super({
            name: "DepsCondition",
            title: "",
            properties: null
        })
        this.arrCdts = e
    }
    satisfy(e) {
        let ret = false;
        for (const cdt of this.arrCdts) {
            if (cdt._execute(e) == XBTStatus.SUCCESS) {
                ret = true;
                break
            }
        }
        return ret
    }
}

