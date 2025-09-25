import { _decorator, Component, Node } from 'cc';
import { XBaseEffect } from './XBaseEffect';
import { XCfgEffectData } from '../xconfig/XCfgData';
import XBuildingModel from '../model/XBuildingModel';
import EventCenter from '../event/EventCenter';
import { XEventNames } from '../event/XEventNames';
import { XBuildType } from '../xconfig/XEnum';
import XMgr from '../XMgr';
import { XBufBase } from '../buf/XBufBase';
const { ccclass, property } = _decorator;

@ccclass('XTowerBuffEffect')
export class XTowerBuffEffect extends XBaseEffect {

    map = new Map<XBuildingModel, XBufBase>
    constructor(cfg_: XCfgEffectData, buildModelData_: XBuildingModel) {
        super(cfg_, buildModelData_)

        EventCenter.on(XEventNames.E_BUILDING_BUILD, this.onBuildingBuild, this)
        EventCenter.on(XEventNames.E_BUILDING_REMOVED, this.onBuildingRemove, this)
    }

    onBuildingBuild(buildModel_) {
        buildModel_.roomId == this._data.roomId && buildModel_.type == XBuildType.tower && this.addBuff(buildModel_)
    }
    onBuildingRemove(buildModel_) {
        buildModel_.roomId == this._data.roomId && buildModel_.type == XBuildType.tower && this.removeBuff(buildModel_)
    }

    createBuff(): XBufBase {
        return null
    }

    addBuff(buildModel_: XBuildingModel) {
        const buff = this.createBuff()
        if (buff) {
            XMgr.buffMgr.addBuff(buildModel_, buff)
            this.map.set(buildModel_, buff)
        }
    }

    removeBuff(buildModel_: XBuildingModel) {
        const buff = this.map.get(buildModel_)
        XMgr.buffMgr.removeBuff(buildModel_, buff)
        this.map.delete(buildModel_)
    }

    clear() {
        EventCenter.off(XEventNames.E_BUILDING_BUILD, this.onBuildingBuild, this)
        EventCenter.off(XEventNames.E_BUILDING_REMOVED, this.onBuildingRemove, this)

        let room = XMgr.buildingMgr.getRoom(this._data.roomId);
        for (const building of room.buildings)
            building.type == XBuildType.tower && this.removeBuff(building)
    }
}


