import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('XBTBlackboard')
export class XBTBlackboard {
    _baseMemory = {}
    _treeMemory = {}

    _getTreeMemory(key_) {
        this._treeMemory[key_] || (this._treeMemory[key_] = {
            nodeMemory: {},
            openNodes: [],
            traversalDepth: 0,
            traversalCycle: 0
        })
        return this._treeMemory[key_]
    }
    _getNodeMemory(t, key_) {
        let a = t.nodeMemory;
        return a[key_] || (a[key_] = {}), a[key_]
    }
    _getMemory(t, e) {
        let a = this._baseMemory;
        return t && (a = this._getTreeMemory(t), e && (a = this._getNodeMemory(a, e))), a
    }
    set(t, e, a, n) {
        this._getMemory(a, n)[t] = e
    }
    get(t, e, a) {
        return this._getMemory(e, a)[t]
    }
}

