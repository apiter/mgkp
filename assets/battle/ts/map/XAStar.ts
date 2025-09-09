import { XBlockNode, XGrid } from "./XGrid";

export default class XAStar {
    _straightCost = 1
    _diagCost = Math.SQRT2
    _slant = false
    _grid: XGrid = null
    _open: XBlockNode[] = []
    _closed: XBlockNode[] = []
    _startNode: XBlockNode = null
    _endNode: XBlockNode = null
    _path: XBlockNode[] = []

    constructor() {
    }

    findPath(grid_: XGrid, slant_: boolean) {
        this._grid = grid_
        this._open = []
        this._closed = []
        this._startNode = this._grid.startNode
        this._endNode = this._grid.endNode
        this._startNode.g = 0
        this._startNode.h = this.euclidian(this._startNode)
        this._startNode.f = this._startNode.g + this._startNode.h
        slant_ && (this.slant = slant_)
        return this.search()
    }
    search() {
        for (let nowNode = this._startNode; nowNode != this._endNode;) {
            for (var t = Math.max(0, nowNode.x - 1), i = Math.min(this._grid.numCols - 1, nowNode.x + 1), s = Math.max(0, nowNode.y - 1), a = Math.min(this._grid.numRows - 1, nowNode.y + 1), n = t; n <= i; n++)
                for (var r = s; r <= a; r++)
                    if (this._slant || n == nowNode.x || r == nowNode.y) {
                        var node = this._grid.getNode(n, r);
                        if (node != nowNode && node.walkable && this._grid.getNode(nowNode.x, node.y).walkable && this._grid.getNode(node.x, nowNode.y).walkable) {
                            var cost = this._straightCost;
                            nowNode.x != node.x && nowNode.y != node.y && (cost = this._diagCost);
                            var h = nowNode.g + cost * node.costMultiplier,
                                d = this.euclidian(node),
                                u = h + d;
                            this.isOpen(node) || this.isClosed(node) ? node.f > u && (node.f = u, node.g = h, node.h = d, node.parent = nowNode) : (node.f = u, node.g = h, node.h = d, node.parent = nowNode, this._open.push(node))
                        }
                    }
            if (this._closed.push(nowNode), 0 == this._open.length) return console.log("AStar >> no path found", n, r), false;
            let g = this._open.length;
            for (let e = 0; e < g; e++)
                for (let t = e + 1; t < g; t++)
                    if (this._open[e].f > this._open[t].f) {
                        let i = this._open[e];
                        this._open[e] = this._open[t], this._open[t] = i
                    }
            nowNode = this._open.shift()
        }
        this.buildPath()
        return true
    }
    buildPath() {
        this._path = [];
        var e = this._endNode;
        for (this._path.push(e); e != this._startNode;) e = e.parent, this._path.unshift(e)
    }
    get path() {
        return this._path
    }
    isOpen(node_: XBlockNode) {
        for (var t = 0; t < this._open.length; t++)
            if (this._open[t] == node_) return !0;
        return !1
    }
    isClosed(node_: XBlockNode) {
        for (var t = 0; t < this._closed.length; t++)
            if (this._closed[t] == node_) return true;
        return false
    }
    manhattan(e) {
        return Math.abs(e.x - this._endNode.x) * this._straightCost + Math.abs(e.y + this._endNode.y) * this._straightCost
    }
    euclidian(node_: XBlockNode) {
        var t = node_.x - this._endNode.x,
            i = node_.y - this._endNode.y;
        return Math.sqrt(t * t + i * i) * this._straightCost
    }
    diagonal(node_: XBlockNode) {
        var t = Math.abs(node_.x - this._endNode.x),
            i = Math.abs(node_.y - this._endNode.y),
            s = Math.min(t, i),
            a = t + i;
        return this._diagCost * s + this._straightCost * (a - 2 * s)
    }
    get visited() {
        return this._closed.concat(this._open)
    }
    set slant(slant_) {
        this._slant = slant_
    }
}