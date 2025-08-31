import XBTAction from './XBTAction';
import { XBTCategory, XBTStatus } from './XBTEnum';

export class XBTSucceeder extends XBTAction {
    constructor() {
        super({
            name: "Succeeder", title: "", properties: null
        })
    }
    tick(e) {
        return XBTStatus.SUCCESS
    }
}
XBTSucceeder.register("BTSucceeder", XBTCategory.ACTION);


