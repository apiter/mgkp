import { director, Scheduler } from "cc";
import XBuildingModel from "../model/XBuildingModel";
import { XCfgEffectData } from "../xconfig/XCfgData";
import { XGameMode } from "../xconfig/XEnum";
import XMgr from "../XMgr";
import { XBaseEffect } from "./XBaseEffect";

export class XCoinEffect extends XBaseEffect {
    deltaX = 0
    deltaY = 0
    extra = 0
    godExtra = 0
    addValue = 0
    canDouble = 0

    constructor(cfg_: XCfgEffectData, buildModel_: XBuildingModel) {
        super(cfg_, buildModel_)
        this.deltaX = 0, this.deltaY = 0, this.extra = 0, this.godExtra = 0, this.addValue = this.cfg.value[0];
        let duration = 1
        //TODO

        if (1e3 == buildModel_.id) {
            let i = XMgr.buildingMgr.getBuildCfg(buildModel_.id, buildModel_.lv);
            if (XMgr.gameMgr.gameMode == XGameMode.E_Defense && i.buffId && this._data.playerUuid == XMgr.playerMgr.mineUuid) {
                //TODO
            }
        }
        Scheduler.enableForTarget(this)
        director.getScheduler().schedule(this.exec, this, duration)
    }
    exec() {
        if(!this._data.playerUuid)
            return
        let addValue = this.addValue;
        this.canDouble && this._data.playerUuid == XMgr.playerMgr.mineUuid && (addValue *= 2);
        let value = addValue * this._data.coinRatio
        let aiMult = value * XMgr.mapMgr.getRoomById(this._data.roomId).aiMult
        let changeRet = XMgr.playerMgr.changePlayerIncomeByUuid(this._data.playerUuid, aiMult + this.extra + this.godExtra)
        //let r = this.data;
        // console.debug(`玩家[${XMgr.playerMgr.getPlayerName(this._data.playerUuid)}] [${this._data.ownerScript?.cfg?.name}]金币变化${aiMult + this.extra + this.godExtra} 现金币:${XMgr.playerMgr.getPlayerCoin(this._data.playerUuid)} `)
        //TODO
        this.showWorkEff()
    }

    clear() {
        director.getScheduler().unschedule(this.exec, this)
    }
}


