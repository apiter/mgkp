import { _decorator, Component, Node } from 'cc';
import { XBaseEffect } from './XBaseEffect';
import XBuildingModel from '../model/XBuildingModel';
import { XCfgEffectData } from '../xconfig/XCfgData';
import { XEventNames } from '../event/XEventNames';
import XPlayerModel from '../model/XPlayerModel';
import XMgr from '../XMgr';
import { XTokenType } from '../xconfig/XEnum';
const { ccclass, property } = _decorator;

@ccclass('XDoorGetCoinOnHurt')
export class XDoorGetCoinOnHurt extends XBaseEffect {
    constructor(cfg_: XCfgEffectData, buildModel_: XBuildingModel) {
        super(cfg_, buildModel_)
        let door = this.getCurDoorModel()[0];
        door && door.owner.on(XEventNames.Battle_Be_Hit, this.exec, this)
    }

    exec(atkModel_: XPlayerModel) {
        const addCoin = this.addValue * atkModel_.attackPower
        if (XMgr.playerMgr.changePlayerIncomeByUuid(this._data.playerUuid, addCoin, 0)) {
            XMgr.gameUI.valueTips(XTokenType.E_Coin, addCoin, this._node.x, this._node.y)
        }
    }
    
    clear(): void {
        let door = this.getCurDoorModel()[0];
        door && door.owner.off(XEventNames.Battle_Be_Hit, this.exec, this)
    }
}


