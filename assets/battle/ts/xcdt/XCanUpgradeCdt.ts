import { director, game } from "cc";
import { XBTCondition } from "../bt2/XBTCondition";
import { XBTCategory } from "../bt2/XBTEnum";
import { XPlayerScript } from "../view/player/XPlayerScript";
import XBuildingModel from "../model/XBuildingModel";
import { XBuildType, XGameMode } from "../xconfig/XEnum";
import { XRandomUtil } from "../xutil/XRandomUtil";
import { XPropertiesKey } from "./XPropertiesKey";
import XMgr from "../XMgr";

export class XCanUpgradeCdt extends XBTCondition {
    static NAME = "XCanUpgradeCdt"
    skillBuildArr = []
    lastCheckTime = 0
    lastUpObj = null
    lastBuildObj = null
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
        if (false === this.isBuild) {
            let allTowers = playerScript.getOwnerAllBuildings(XBuildType.tower)
            let allEnergys = playerScript.getOwnerAllBuildings(XBuildType.energy)
            const rd = XRandomUtil.random()
            if (ownerBed.lv < 5) {
                if (rd < 0.7) {
                    lastUpObj = ownerBed
                }
                else if (rd < 0.75) {
                    if (allTowers.length > 0) {
                        lastUpObj = XRandomUtil.randomInArray(allTowers)
                    } else {
                        lastBuildObj = "3000_1" //1级塔
                        this.isBuild = true
                    }
                } else {
                    lastUpObj = roomDoor
                }
            } else {
                //TODO
            }
            if (lastUpObj) {
                this.lastUpObj = lastUpObj
                if (playerScript.hasEnoughCoinEnergy(lastUpObj)) {
                    this.output(XPropertiesKey.UPGRADE, lastUpObj)
                    this.lastBuildObj = null
                    this.lastUpObj = null
                    if (XMgr.gameMgr.gameMode == XGameMode.E_Defense) {
                        let room = XMgr.mapMgr.getRoomById(lastUpObj.roomId);
                        if (XMgr.gameMgr.mapId == 1) {
                            if (lastUpObj.lv > 4) room.aiMult = XRandomUtil.randomInArray(XMgr.gameMgr.aiMultArr);
                        } else if (XMgr.gameMgr.mapId == 2) {
                            if (lastUpObj.lv >= 4 && room.aiMult == 1) {
                                room.aiMult = XRandomUtil.randomInArray(XMgr.gameMgr.aiMultArr);
                            }
                        } else if (lastUpObj.lv > 6) {
                            if (room.aiMult != 1) room.aiMult = 1;
                        } else if (lastUpObj.lv >= 4 && room.aiMult == 1) {
                            room.aiMult = XRandomUtil.randomInArray(XMgr.gameMgr.aiMultArr);
                        }
                    }
                }
                else {
                    if (XRandomUtil.random() < 0.2) {
                        this.lastBuildObj = this.lastUpObj = null;
                    }
                    lastUpObj = null;
                }
            }


            // 处理建造逻辑
            if (lastBuildObj) {
                this.lastBuildObj = lastBuildObj;
                let build = playerScript.createBuilding(lastBuildObj);

                if (build && playerScript.hasEnoughCoinEnergy(build, !0)) {
                    this.output(XPropertiesKey.BUILD, build);
                    this.isBuild = this.lastBuildObj = this.lastUpObj = null;
                } else {
                    if (XRandomUtil.random() < 0.2) {
                        this.isBuild = this.lastBuildObj = this.lastUpObj = null;
                    }
                    lastBuildObj = null;
                }
            }
        }
        return true
    }
}
XCanUpgradeCdt.register(XCanUpgradeCdt.NAME, XBTCategory.CONDITION);
