import { director, Scheduler } from 'cc';
import XBuildingModel from '../model/XBuildingModel';
import { XCfgEffectData } from '../xconfig/XCfgData';
import { XConst } from '../xconfig/XConst';
import { XBaseEffect } from './XBaseEffect';
import XMgr from '../XMgr';
import { XTokenType } from '../xconfig/XEnum';

export class XEnergyEffect extends XBaseEffect {

    constructor(cfg_: XCfgEffectData, buildModel_: XBuildingModel) {
        super(cfg_, buildModel_)
        this.addValue = this.cfg.value[0] * XConst.TestEnergyMul;
        let duration = 1

        Scheduler.enableForTarget(this)
        director.getScheduler().schedule(this.exec, this, duration)
    }
    
    exec() {
        if (!this._data.playerUuid)
            return
        let addValue = this.addValue;
        let value = addValue * this._data.energyRatio
        let aiMult = value * XMgr.mapMgr.getRoomById(this._data.roomId).aiMult
        const result = XMgr.playerMgr.changePlayerIncomeByUuid(this._data.playerUuid, 0, aiMult)
        if (result) {
            XMgr.gameUI.valueTips(XTokenType.E_Energy, value, this._node.x, this._node.y, 0)
        }
        //TODO
        this.showWorkEff()
    }

    clear() {
        director.getScheduler().unschedule(this.exec, this)
    }
}


