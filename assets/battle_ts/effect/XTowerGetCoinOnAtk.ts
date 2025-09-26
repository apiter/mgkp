import { _decorator, Component, director, Node, Scheduler } from 'cc';
import { XBaseEffect } from './XBaseEffect';
import { XCfgEffectData } from '../xconfig/XCfgData';
import XBuildingModel from '../model/XBuildingModel';
import XMgr from '../XMgr';
import { XTokenType } from '../xconfig/XEnum';
import { XEventNames } from '../event/XEventNames';
const { ccclass, property } = _decorator;

@ccclass('XTowerGetCoinOnAtk')
export class XTowerGetCoinOnAtk extends XBaseEffect {
    curCnt = 0
    buffMult = 1

    constructor(cfg_: XCfgEffectData, data_: XBuildingModel) {
        super(cfg_, data_)
        Scheduler.enableForTarget(this)
        director.getScheduler().schedule(this.exec, this, 1)

        let bed = XMgr.buildingMgr.getRoom(this._data.roomId).bedModelList[0];
        bed && bed.owner.on(XEventNames.Tower_Be_fire, this.addCoin, this)
    }

    
    addCoin(bedLv_) {
        // if (this.data.palsyTime) return;
        let bed = XMgr.buildingMgr.getRoom(this._data.roomId).bedModelList[0],
            s = XMgr.buildingMgr.getBuildCfg(bed.id, bed.lv).effectList[0].value[0],
            a = Math.ceil(s / 200 * bedLv_ * this.buffMult);
        this.curCnt += a
    }

    exec() {
        if (!this.curCnt) return;

        let coin = this.addValue * this._data.coinRatio * this.curCnt;
        this.curCnt = 0;

        if (coin) {
            let changed = XMgr.playerMgr.changePlayerIncomeByUuid(this._data.playerUuid, coin);
            if (changed) {
                XMgr.gameUI.valueTips(XTokenType.E_Coin, coin, this._node.x, this._node.y);
                this.showWorkEff();
            }
        }
    }

    
    clear() {
        director.getScheduler().unschedule(this.exec, this)
        let bed = XMgr.buildingMgr.getRoom(this._data.roomId).bedModelList[0];
        bed && bed.owner && bed.owner.isValid && bed.owner?.off(XEventNames.Tower_Be_fire, this.addCoin, this)
    }
}


