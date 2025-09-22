import XBTBaseNode from "./XBTBaseNode";
import { XBTCategory } from "./XBTEnum";
export default
class XBTAction extends XBTBaseNode {
    constructor({
        name: e = "Action",
        title: a = "",
        properties: n = null
    }) {
        super({
            category: XBTCategory.ACTION,
            name: e,
            title: a,
            properties: n
        })
    }
}

