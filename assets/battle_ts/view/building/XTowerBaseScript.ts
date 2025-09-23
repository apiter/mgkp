import { _decorator, Component, game, Node } from 'cc';
import { XBuildingScript } from './XBuildingScript';
import XTowerModel from '../../model/XTowerModel';
import XMgr from '../../XMgr';
import { XGameStatus } from '../../xconfig/XEnum';
import { XConst } from '../../xconfig/XConst';
const { ccclass, property } = _decorator;

@ccclass('XTowerBaseScript')
export class XTowerBaseScript extends XBuildingScript {

    _towerData: XTowerModel = null
    canAttack = true
    lastAtkTime = 0;
    isWork = false

    init(buildModel_, cdTime_?: number): void {
        super.init(buildModel_, cdTime_)
        this._towerData = this.data as XTowerModel
    }

    getAtkCD() {
        let cd = this._towerData.getAtkCD()

        return Math.max(0.2, cd) * 1000
    }

    getAtkDstSqu() {
        let atkDst = this._towerData.getAtkDst();
        let result = atkDst;
        let px = result * XConst.GridSize;
        return px * px;
    }

    protected update(dt: number): void {
        super.update?.(dt)
        
        if(XMgr.gameMgr.gameStatus !== XGameStatus.E_GAME_START) return
        if (this.canAttack == false) return
        if (this.isBuildCd) return
        let now = game.totalTime;
        if (now - this.lastAtkTime > this.getAtkCD()) {
            this.lastAtkTime = now
            this.tryAttack()
        }
    }

    tryAttack() {

    }
}


