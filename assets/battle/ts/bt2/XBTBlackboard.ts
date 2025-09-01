export class XBTBlackboard {
    _baseMemory = {}
    _treeMemory = {}

    _getTreeMemory(treeKey_) {
        this._treeMemory[treeKey_] || (this._treeMemory[treeKey_] = {
            nodeMemory: {},
            openNodes: [],
            traversalDepth: 0,
            traversalCycle: 0
        })
        return this._treeMemory[treeKey_]
    }
    _getNodeMemory(node_, key_) {
        let nodeMemory = node_.nodeMemory;
        nodeMemory[key_] || (nodeMemory[key_] = {})
        return nodeMemory[key_]
    }
    _getMemory(treeKey_, nodeKey_) {
        let memory = this._baseMemory;
        if (treeKey_) {
            memory = this._getTreeMemory(treeKey_)
            nodeKey_ && (memory = this._getNodeMemory(memory, nodeKey_))
        }
        return memory
    }
    set(key_, value_, treeKey_, nodeKey_ = null) {
        this._getMemory(treeKey_, nodeKey_)[key_] = value_
    }
    get(key_, treeKey_, nodeKey_ = null) {
        return this._getMemory(treeKey_, nodeKey_)[key_]
    }
}

