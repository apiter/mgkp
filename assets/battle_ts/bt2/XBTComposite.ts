import XBTBaseNode from './XBTBaseNode';
import { XBTCategory } from './XBTEnum';

export default class XBTComposite extends XBTBaseNode {
    children: XBTBaseNode[] = []

    constructor({
        children: children_ = [],
        name: name_ = "Composite",
        title: title_ = "",
        properties: properties_
    }) {
        super({
            category: XBTCategory.COMPOSITE,
            name: name_,
            title: title_,
            properties: properties_
        })
        this.children = children_.slice(0)
    }
    add(t) {
        this.children.push(t)
    }
}


