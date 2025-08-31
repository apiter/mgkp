import XBTBaseNode from "./XBTBaseNode"

export default class XBTTick {
    _openNodes: XBTBaseNode[] = []
    _nodeCount = 0
    tree = null
    debug = null
    blackboard = null
    target = null

    _enterNode(t) {
        this._nodeCount++
        this._openNodes.push(t)
    }

    _openNode(t) { }
    _tickNode(t) { }

    _closeNode(t) {
        this._openNodes.pop()
    }
    
    _exitNode(t) { }
}

