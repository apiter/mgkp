import { director, Scheduler } from "cc";
import XBuildingModel from "../model/XBuildingModel";
import { XCfgEffectData } from "../xconfig/XCfgData";
import { XGameMode } from "../xconfig/XEnum";
import XMgr from "../XMgr";
import { XBaseEffect } from "./XBaseEffect";
import { XConst } from "../xconfig/XConst";

export class XCoinEffect extends XBaseEffect {
    addValue = 0

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
        let addValue = this.addValue;
        let value = addValue * this._data.coinRatio
        let aiMult = value * XMgr.mapMgr.getRoomById(this._data.roomId).aiMult
        let changeRet = XMgr.playerMgr.changePlayerIncomeByUuid(this._data.playerUuid, aiMult)
        //let r = this.data;
        // console.debug(`玩家[${XMgr.playerMgr.getPlayerName(this._data.playerUuid)}] [${this._data.ownerScript?.cfg?.name}]金币变化${aiMult + this.extra + this.godExtra} 现金币:${XMgr.playerMgr.getPlayerCoin(this._data.playerUuid)} `)
        //TODO
        this.showWorkEff()
    }

    clear() {
        director.getScheduler().unschedule(this.exec, this)
    }
}


