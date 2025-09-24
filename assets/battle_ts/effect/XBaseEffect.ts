import { ISchedulable, Node } from "cc";
import XBuildingModel from "../model/XBuildingModel";
import { XCfgEffectData } from "../xconfig/XCfgData";
import { XBuildType, XEffectType } from "../xconfig/XEnum";
import XMgr from "../XMgr";
import { XBuildingScript } from "../view/building/XBuildingScript";

export class XBaseEffect implements ISchedulable {
    cfg: XCfgEffectData
    type: string
    _data: XBuildingModel
    _node: Node
    _ownerScript: XBuildingScript
    clearFlag = true
    addValue = 0
    
    constructor(cfg_: XCfgEffectData, data_: XBuildingModel) {
        cfg_ && (this.type = cfg_.type, this.cfg = cfg_)
        this._data = data_
        this._ownerScript = data_?.ownerScript
        this._node = data_?.owner
        this.addValue = this.cfg.value[0]
    }

    clear() { }

    getCurDoorModel() {
        let doors:XBuildingModel[] = []
        let room = XMgr.buildingMgr.getRoom(this._data.roomId);
        if (room) {
            for (const build of room.buildings)
                if (build.type == XBuildType.door) {
                    doors.push(build);
                    break
                }
        }
        return doors
    }

    getBuildingHpLowest() {
        let player = XMgr.playerMgr.getPlayer(this._data.playerUuid);
        if (player) {
            let loweastHpPercent, retBuild, buildings = player.buildings;
            for (const build of buildings) {
                if (!build.owner || build.isDie) continue;
                if (build.curHp <= 0) continue;
                let hpPercent = build.curHp / build.maxHp;
                loweastHpPercent || (loweastHpPercent = hpPercent, retBuild = build)
                hpPercent < loweastHpPercent && (loweastHpPercent = hpPercent, retBuild = build)
            }
            return retBuild
        }
    }

    playerWorkEff() { }

    showWorkEff() {
    }

    update(dt: number): void {
        
    }
}


