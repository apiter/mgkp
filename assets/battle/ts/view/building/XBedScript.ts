import { _decorator, Component, Node } from 'cc';
import { XBuildingScript } from './XBuildingScript';
import EventCenter from '../../event/EventCenter';
import { XEventNames } from '../../event/XEventNames';
import XMgr from '../../XMgr';
import { XEffectType } from '../../xconfig/XEnum';
import LogWrapper, { XLogModule } from '../../log/LogWrapper';
const { ccclass, property } = _decorator;

@ccclass('XBedScript')
export class XBedScript extends XBuildingScript {
    protected onLoad(): void {
        EventCenter.on(XEventNames.E_Bed_Up, this.onPlayerGotoBed, this)
        EventCenter.on(XEventNames.E_Bed_Down, this.onPlayerDownBed, this)
    }

    protected onDestroy(): void {
        super.onDestroy()
        EventCenter.off(XEventNames.E_Bed_Up, this.onPlayerGotoBed, this)
        EventCenter.off(XEventNames.E_Bed_Down, this.onPlayerDownBed, this)
    }

    onPlayerGotoBed(buildMode_, playerUuid_) {
        if (!buildMode_ || buildMode_ != this.data) return;
        let playTime = XMgr.gameMgr.playTime,
            roomModel = XMgr.mapMgr.getRoomById(buildMode_.roomId),
            coin = 0,
            energy = 0;
        for (const i of roomModel.buildings) {
            let s = XMgr.buildingMgr.getBuildCfg(i.id);
            if (s.effectList)
                for (const t of s.effectList)
                    if (t.type == XEffectType.Add_Coin)
                        coin += t.value[0] * playTime;
                    else if (t.type == XEffectType.Add_Energy) {
                        let e = t.value[1] ? t.value[1] : 1;
                        energy += Math.floor(t.value[0] * playTime / e)
                    }
        }
        LogWrapper.log("流程", `玩家[${playerUuid_}] 上床`, {}, [XLogModule.XLogModuleGameFlow])
        XMgr.playerMgr.changePlayerIncomeByUuid(this.data.playerUuid, coin, energy);
        for (const effect of this.effects)
            effect._data.playerUuid = buildMode_.playerUuid;
        buildMode_.playerUuid = playerUuid_
        0 == this.effects.length && this.initEffects()
    }

    onPlayerDownBed() {

    }
}


