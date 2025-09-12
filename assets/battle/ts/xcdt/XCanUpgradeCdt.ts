import { director, game } from "cc";
import { XBTCondition } from "../bt2/XBTCondition";
import { XBTCategory } from "../bt2/XBTEnum";
import { XPlayerScript } from "../view/player/XPlayerScript";
import XBuildingModel from "../model/XBuildingModel";
import { XBuildType, XGameMode } from "../xconfig/XEnum";
import { XRandomUtil } from "../xutil/XRandomUtil";
import { XPropertiesKey } from "./XPropertiesKey";
import XMgr from "../XMgr";
import LogWrapper, { XLogModule } from "../log/LogWrapper";

export class XCanUpgradeCdt extends XBTCondition {
    static NAME = "XCanUpgradeCdt"
    skillBuildArr = []
    lastCheckTime = 0
    lastUpObj = null
    lastBuildObj: string = null
    isBuild = false
    isFreeUpDoor = false

    constructor(child_ = null) {
        super({
            name: XCanUpgradeCdt.NAME, title: "", properties: null,
            child: child_
        })
    }
    satisfy(data_) {
        const timeNow = game.totalTime
        if (this.lastCheckTime + 1000 > timeNow)
            return false
        this.lastCheckTime = timeNow
        const playerScript = data_.target as XPlayerScript
        const ownerBed = playerScript.getOwnerBed()
        const roomDoor = playerScript.getRoomDoor() as XBuildingModel
        if (ownerBed == null || roomDoor == null)
            return false
        if (roomDoor.curHp < roomDoor.maxHp * 0.5) {
            this.lastUpObj = roomDoor
            this.lastBuildObj = null
            this.isBuild = true
        }
        let lastUpObj = this.lastUpObj
        let lastBuildObj = this.lastBuildObj
        if (!this.isBuild) {
            let allTowers = playerScript.getOwnerAllBuildings(XBuildType.tower)
            let allEnergys = playerScript.getOwnerAllBuildings(XBuildType.energy)
            if (ownerBed.lv < 5) {
                const rd1 = XRandomUtil.random()
                if (rd1 < 0.7) {
                    lastUpObj = ownerBed
                    LogWrapper.log("建造I", `[${playerScript.skinCfg.name}] 准备升级床lv${ownerBed.lv}`, {}, [XLogModule.XLogModuleBT])
                }
                else if (rd1 < 0.75) {
                    if (allTowers.length > 0) {
                        lastUpObj = XRandomUtil.randomInArray(allTowers)
                        LogWrapper.log("建造I", `[${playerScript.skinCfg.name}] 准备随机升级炮台lv${lastUpObj.lv}`, {}, [XLogModule.XLogModuleBT])
                    } else {
                        lastBuildObj = "3000_1" //1级塔
                        this.isBuild = true
                        LogWrapper.log("建造I", `[${playerScript.skinCfg.name}] 准备创建炮台lv1`, {}, [XLogModule.XLogModuleBT])
                    }
                } else {
                    lastUpObj = roomDoor
                    LogWrapper.log("建造I", `[${playerScript.skinCfg.name}] 准备升级门lv${roomDoor.lv}`, {}, [XLogModule.XLogModuleBT])
                }
            } else {
                let rd2 = XRandomUtil.random()
                if (rd2 < 0.4) {
                    lastUpObj = ownerBed
                    LogWrapper.log("建造I", `[${playerScript.skinCfg.name}] 准备升级床lv${ownerBed.lv}`, {}, [XLogModule.XLogModuleBT])
                } else if (rd2 < 0.7) {
                    if (allTowers.length > 0) {
                        lastUpObj = allTowers[XRandomUtil.getIntRandom(0, allTowers.length - 1)];
                        LogWrapper.log("建造I", `[${playerScript.skinCfg.name}] 准备随机升级炮台lv${lastUpObj.lv}`, {}, [XLogModule.XLogModuleBT])
                    } else {
                        lastBuildObj = "3000_1";
                        this.isBuild = true;
                        LogWrapper.log("建造I", `[${playerScript.skinCfg.name}] 准备创建炮台lv1`, {}, [XLogModule.XLogModuleBT])
                    }
                } else if (rd2 < 0.85) {
                    lastUpObj = roomDoor;
                    LogWrapper.log("建造I", `[${playerScript.skinCfg.name}] 准备升级门lv${roomDoor.lv}`, {}, [XLogModule.XLogModuleBT])
                } else {
                    if (allEnergys.length > 0) {
                        lastUpObj = allEnergys[XRandomUtil.getIntRandom(0, allEnergys.length - 1)];
                        LogWrapper.log("建造I", `[${playerScript.skinCfg.name}] 准备随机升级能量建筑lv${lastUpObj.lv}`, {}, [XLogModule.XLogModuleBT])
                    } else {
                        lastBuildObj = "4000_1";
                        this.isBuild = true;
                        LogWrapper.log("建造I", `[${playerScript.skinCfg.name}] 准备创建背包lv1`, {}, [XLogModule.XLogModuleBT])
                    }
                }
            }
            if (lastUpObj) {
                this.lastUpObj = lastUpObj
                if (playerScript.hasEnoughCoinEnergy(lastUpObj)) {
                    this.output(XPropertiesKey.UPGRADE, lastUpObj)
                    this.lastBuildObj = null
                    this.lastUpObj = null
                }
                else {
                    if (XRandomUtil.random() < 0.2) {
                        this.lastBuildObj = this.lastUpObj = null;
                        LogWrapper.log("建造I", `[${playerScript.skinCfg.name}] 放弃升级的决定`, {}, [XLogModule.XLogModuleBT])
                    }
                    lastUpObj = null;
                }
            }


            // 处理建造逻辑
            if (lastBuildObj) {
                this.lastBuildObj = lastBuildObj;
                let build = playerScript.createBuilding(lastBuildObj);

                if (build && playerScript.hasEnoughCoinEnergy(build, true)) {
                    this.output(XPropertiesKey.BUILD, build);
                    this.isBuild = false;
                    this.lastBuildObj = this.lastUpObj = null;
                } else {
                    if (XRandomUtil.random() < 0.2) {
                        this.lastBuildObj = this.lastUpObj = null;
                        LogWrapper.log("建造I", `[${playerScript.skinCfg.name}] 放弃建造的决定`, {}, [XLogModule.XLogModuleBT])
                    }
                    lastBuildObj = null;
                    this.isBuild = false;
                }
            }
        }
        return !!(lastUpObj || lastBuildObj);
    }
}
XCanUpgradeCdt.register(XCanUpgradeCdt.NAME, XBTCategory.CONDITION);
