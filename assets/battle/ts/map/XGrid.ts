export class XBlockNode {
    walkable = true
    dynWalkable = true
    costMultiplier = 1
    x = 0
    y = 0
    constructor(x_, y_) {
        this.x = x_, this.y = y_
    }
}

export class XGrid {
    _col: number = 0
    _row: number = 0
    _nodes: XBlockNode[][] = []
    _startNode: XBlockNode = null
    _endNode: XBlockNode = null
    
    constructor(col_: number, row_: number) {
        this._col = col_, this._row = row_, this._nodes = [];
        for (let c = 0; c < col_; c++) {
            this._nodes[c] = [] as XBlockNode[];
            for (let r = 0; r < row_; r++) this._nodes[c][r] = new XBlockNode(c, r)
        }
    }
    getNode(col_: number, row_: number) {
        return col_ < 0 || col_ >= this.numCols || row_ < 0 || row_ >= this.numRows ? null : this._nodes[col_][row_]
    }
    setEndNode(e, t) {
        if (this._endNode = this.getNode(e, t), null == this._endNode) return !1;
        if (!this._endNode.walkable) {
            let i = [],
                s = this.getNode(e - 1, t),
                a = this.getNode(e + 1, t),
                n = this.getNode(e, t - 1),
                r = this.getNode(e, t + 1);
            if (null != s && s.walkable && i.push(s), null != a && a.walkable && i.push(a), null != n && n.walkable && i.push(n), null != r && r.walkable && i.push(r), i.length > 0) {
                let e = i[Math.floor(Math.random() * i.length)];
                this._endNode = e
            }
        }
        return !0
    }
    setStartNode(e, t) {
        this._startNode = this._nodes[e][t]
    }
    setWalkable(e, t, i) {
        this._nodes[e][t].walkable = i
    }
    setDynWalkable(e, t, i) {
        this._nodes[e][t].dynWalkable = i
    }
    get endNode() {
        return this._endNode
    }
    get numCols() {
        return this._col
    }
    get numRows() {
        return this._row
    }
    get startNode() {
        return this._startNode
    }
}