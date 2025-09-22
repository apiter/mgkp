import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('XMapBuildingScript')
export class XMapBuildingScript extends Component {
    _gridX = 0
    _gridY = 0
    _buildCfg
    isUsed = false
    isTarget = false
    _buildName = ""
    init(grid, cfg_, buildName_) {
        this._gridX = grid.x, 
        this._gridY = grid.y, 
        this._buildCfg = cfg_, 
        this.isUsed = false, 
        this.isTarget = false, 
        this._buildName = buildName_
    }
}


