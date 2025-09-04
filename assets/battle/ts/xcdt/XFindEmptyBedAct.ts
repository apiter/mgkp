import { XBTCondition } from "../bt2/XBTCondition";
import { XBTCategory } from "../bt2/XBTEnum";
import XBuildingModel from "../model/XBuildingModel";
import { XRoomModel } from "../model/XRoomModel";
import { XPlayerScript } from "../view/player/XPlayerScript";
import XMgr from "../XMgr";
import { XRandomUtil } from "../xutil/XRandomUtil";

export class XFindEmptyBedAct extends XBTCondition {
    lastBed: XBuildingModel = null
    static NAME = "XFindEmptyBedAct"
    constructor(child_ = null) {
        super({
            name: XFindEmptyBedAct.NAME,
            title: "",
            properties: null,
            child: child_
        })
    }
    satisfy(data_) {
        let isBedUsed, playerScript = data_.target as XPlayerScript;
        let lastBed = this.lastBed;

        if (!this.lastBed || (isBedUsed = playerScript.isBedUsed(this.lastBed))) {
            let allRoomIdsRand = data_.blackboard.get(XFindEmptyBedAct.NAME);

            if (!allRoomIdsRand || allRoomIdsRand.length === 0) {
                allRoomIdsRand = playerScript.getAllRoomIdRand();
                data_.blackboard.set(XFindEmptyBedAct.NAME, allRoomIdsRand);
            }

            lastBed = null;

            // if (isBedUsed) {
            //     let roomModel = playerScript.getRoomModel(this.lastBed.roomId);
            //     let [t, i] = this.findInMoreBedRoom([roomModel]);
            //     lastBed = t;
            //     if (i && t) {
            //         allRoomIdsRand.splice(allRoomIdsRand.indexOf(lastBed.roomId), 1);
            //     }
            // }

            if (!lastBed) {
                let roomIdx = allRoomIdsRand.length
                let roomsCanUse: any[] = []

                for (; roomIdx--;) {
                    // if (XMgr.user.gameInfo.winCnt + XMgr.user.gameInfo.failCnt === 0 && allRoomIdsRand[roomLength] === 3) continue;
                    if (XMgr.gameMgr.defenseFindRoomId.indexOf(allRoomIdsRand[roomIdx]) >= 0)
                        continue;

                    let room = playerScript.getRoomModel(allRoomIdsRand[roomIdx]);
                    if (room) {
                        if ((room.doorModel && room.doorModel.isOpen) || !room.doorModel) {
                            roomsCanUse.push(room)
                        }
                    } else {
                        console.log("FindEmptyBedAction not found room!");
                    }
                }

                let bed = this.findInOneBedRoom(roomsCanUse);
                lastBed = bed;
                if (lastBed) allRoomIdsRand.splice(allRoomIdsRand.indexOf(lastBed.roomId), 1);
            }
        }

        if (lastBed) {
            playerScript.setCurTarget(lastBed);
            if (XMgr.gameMgr.defenseFindRoomId.indexOf(lastBed.roomId) < 0) {
                XMgr.gameMgr.defenseFindRoomId.push(lastBed.roomId);
            }
            this.lastBed = lastBed;
            console.debug(`[${playerScript.skinCfg.name}] 奔向房间:${lastBed.roomId}`)
            return true;
        } else {
            playerScript.setCurTarget(null);
            this.lastBed = void 0;
            return false;
        }
    }

    findInOneBedRoom(rooms) {
        if (0 == rooms.length) return null;
        XRandomUtil.randomArray(rooms);
        let findBed, roomLen = rooms.length;
        for (; roomLen--;) {
            let bed = rooms[roomLen].bedModelList[0];
            if (!bed.isUsed) {
                findBed = bed
                break
            }
        }
        return findBed
    }
}
XFindEmptyBedAct.register(XFindEmptyBedAct.NAME, XBTCategory.ACTION);

