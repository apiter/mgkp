export class XBlockNode {
    walkable = true
    dynWalkable = true
    costMultiplier = 1
    x = 0
    y = 0

    g = 0
    h = 0
    f = 0

    parent:XBlockNode = null
    
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
    setEndNode(gridX_, gridY_) {
        this._endNode = this.getNode(gridX_, gridY_)
        if (null == this._endNode) return false;
        if (!this._endNode.walkable) {
            let i = []
            const left = this.getNode(gridX_ - 1, gridY_)
            const right = this.getNode(gridX_ + 1, gridY_)
            const down = this.getNode(gridX_, gridY_ - 1)
            const up = this.getNode(gridX_, gridY_ + 1);
            null != left && left.walkable && i.push(left)
            null != right && right.walkable && i.push(right)
            null != down && down.walkable && i.push(down)
            null != up && up.walkable && i.push(up)

            if (i.length > 0) {
                let e = i[Math.floor(Math.random() * i.length)];
                this._endNode = e
            }
        }
        return true
    }
    setStartNode(x_, y_) {
        this._startNode = this._nodes[x_][y_]
    }
    setWalkable(x_, y_, value_) {
        this._nodes[x_][y_].walkable = value_
    }
    setDynWalkable(x_, y_, value_) {
        this._nodes[x_][y_].dynWalkable = value_
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