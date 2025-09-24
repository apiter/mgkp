import { director, Scheduler } from "cc";
import XBuildingModel from "../model/XBuildingModel";
import { XCfgEffectData } from "../xconfig/XCfgData";
import { XGameMode, XTokenType } from "../xconfig/XEnum";
import XMgr from "../XMgr";
import { XBaseEffect } from "./XBaseEffect";
import { XConst } from "../xconfig/XConst";

export class XCoinEffect extends XBaseEffect {
    
    constructor(cfg_: XCfgEffectData, buildModel_: XBuildingModel) {
        super(cfg_, buildModel_)
        this.addValue = this.cfg.value[0] * XConst.TestCoinMul;
        let duration = 1

        Scheduler.enableForTarget(this)
        director.getScheduler().schedule(this.exec, this, duration)
    }
    exec() {
        if (!this._data.playerUuid)
            return
        if(!this._node || this._node.isValid == false)
            return
        let addValue = this.addValue;
        let value = addValue * this._data.coinRatio
        let aiMult = value * XMgr.mapMgr.getRoomById(this._data.roomId).aiMult
        let result = XMgr.playerMgr.changePlayerIncomeByUuid(this._data.playerUuid, aiMult)
        if(result) {
            XMgr.gameUI.valueTips(XTokenType.E_Coin, value, this._node.x, this._node.y, 0)
        }
        this.showWorkEff()
    }

    clear() {
        director.getScheduler().unschedule(this.exec, this)
    }
}


