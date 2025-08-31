import XBTBaseNode from "./XBTBaseNode"
import { XBTCategory } from "./XBTEnum"

export default class XBTDecorator extends XBTBaseNode {
    child: XBTBaseNode = null
    constructor({ child = null, name = "Decorator", title = "", properties = null }) {
        super({
            category: XBTCategory.DECORATOR,
            name: name,
            title: title,
            properties: properties
        })
        this.child = child
    }

    add(t) {
        this.child = t
    }
}

