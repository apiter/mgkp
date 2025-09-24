import { director, Scheduler } from "cc";
import { XAtkSpdBuff } from "../buf/XAtkSpdBuff";
import EventCenter from "../event/EventCenter";
import { XEventNames } from "../event/XEventNames";
import XBuildingModel from "../model/XBuildingModel";
import XPlayerModel from "../model/XPlayerModel";
import { XCfgEffectData } from "../xconfig/XCfgData";
import XMgr from "../XMgr";
import { XBaseEffect } from "./XBaseEffect";
import { XConst } from "../xconfig/XConst";
import { XBufBase } from "../buf/XBufBase";

export class XEnemySlowAtkSpd extends XBaseEffect {
    slowMult = 1
    slowRatio = 0
    map = new Map<XPlayerModel, XBufBase>()

    constructor(cfg_: XCfgEffectData, buildModel_: XBuildingModel) {
        super(cfg_, buildModel_)

        this.slowRatio = cfg_.value[0]
        let door:XBuildingModel = this.getCurDoorModel()[0];
        door && (door.owner.on(XEventNames.Battle_Be_Hit, this.exec, this))

        EventCenter.on(XEventNames.E_HUNTER_ESCAPE, this.onHunterEscape, this)
        EventCenter.on(XEventNames.E_HUNTER_LEAVE, this.onHunterEscape, this)


        Scheduler.enableForTarget(this)
        director.getScheduler().schedule(this.onHunterEscapeNoParam, this, 0.1)
    }

    exec(buildModel_, i) {
        let buff;
        if (this.getCurDoorModel()[0]) {
            if (this.map.has(buildModel_)) {
                // this._data.playerUuid == XMgr.playerMgr.player.uuid && XMgr.user.gameInfo.getBuffData(5) && (this.slowMult = 1.5)
                buff = new XAtkSpdBuff(this.slowRatio * this.slowMult);
                for (const [i, a] of this.map) {
                    if (!buildModel_.buffs) continue;
                    let needAnd = true;
                    for (let t = 0; t < buildModel_.buffs.length; t++)
                        if (buildModel_.buffs[t].Type == buff.Type && buildModel_.buffs[t].Val == buff.Val) {
                            needAnd = false;
                            break
                        }
                    needAnd && (XMgr.buffMgr.addBuff(buildModel_, buff), this.playerWorkEff())
                }
            }
            this.map.set(buildModel_, buff)
        }
    }

    onHunterEscape(hunterModel_?: XPlayerModel) {
        let doors = this.getCurDoorModel();

        if (0 != doors.length) {
            for (const door of doors) {
                if (!door) return;

                if (hunterModel_) {
                    for (const [atkModel, buff] of this.map) {
                        if (atkModel == hunterModel_) {
                            XMgr.buffMgr.removeBuff(atkModel, buff);
                            break;
                        }
                    }
                } else {
                    for (const [atkModel, buff] of this.map) {
                        let disX = Math.abs(door.owner.x - atkModel.owner.x);
                        let disY = Math.abs(door.owner.y - atkModel.owner.y);

                        if (disX > 2 * XConst.GridSize && disY > 2 * XConst.GridSize) break;

                        if (disX > XConst.GridSize || disY > XConst.GridSize) {
                            XMgr.buffMgr.removeBuff(atkModel, buff);
                            break;
                        }
                    }
                }
            }
        } else {
            for (const [atkModel, buff] of this.map) {
                let atkSpdBuff = new XAtkSpdBuff(this.slowRatio * this.slowMult);
                if (!atkModel.buffs) continue;

                let atkBufIdx, isExist = true;
                for (atkBufIdx = 0; atkBufIdx < atkModel.buffs.length; atkBufIdx++) {
                    if (atkModel.buffs[atkBufIdx].type == atkSpdBuff.type && atkModel.buffs[atkBufIdx]._val == atkSpdBuff._val) {
                        isExist = false;
                        break;
                    }
                }

                if (!isExist) atkModel.buffs.splice(atkBufIdx, 1);
            }
            this.clear();
        }
    }

    onHunterEscapeNoParam() {
        this.onHunterEscape()
    }

    clear() {
        director.getScheduler().unschedule(this.onHunterEscapeNoParam, this)
        EventCenter.off(XEventNames.E_HUNTER_ESCAPE, this.onHunterEscape, this)
        EventCenter.off(XEventNames.E_HUNTER_LEAVE, this.onHunterEscape, this)

        let doors = this.getCurDoorModel();
        for (const door of doors) {
            if (!door) return;
            door.owner.off(XEventNames.Battle_Be_Hit, this.exec, this);
            for (const [atkModel, buff] of this.map) {
                XMgr.buffMgr.removeBuff(atkModel, buff)
            }
            this.map.clear()
        }
    }
}


