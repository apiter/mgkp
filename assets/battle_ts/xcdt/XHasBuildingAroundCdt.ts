import { XBTCondition } from '../bt2/XBTCondition';
import XBTTick from '../bt2/XBTTick';
import { XPlayerScript } from '../view/player/XPlayerScript';
import { XBuildType, XPlayerType } from '../xconfig/XEnum';
import XMgr from '../XMgr';

export class XHasBuildingAroundCdt extends XBTCondition {
    static NAME = "XHasBuildingAroundCdt"
    constructor() {
        super({
            child: null,
            name: XHasBuildingAroundCdt.NAME,
            properties: null
        })
    }

    satisfy(data_: XBTTick): boolean {
        let playerScript = data_.target as XPlayerScript
        let playModel = playerScript.getDataModel()
        let curTarget = playerScript.getCurTarget()
        let nearestBuilding = playerScript.getNearestBuilding()
        if (nearestBuilding) {
            if (curTarget) {
                let player = XMgr.playerMgr.player

                let target = curTarget.bedModel || curTarget
                if (target) {
                    let roomId = target.roomId
                    //不在同一房间
                    if (roomId !== nearestBuilding.roomId) {
                        if (curTarget.type === XPlayerType.E_Defender) {
                            playerScript.setCurTarget(nearestBuilding)
                            return true
                        }
                        if (curTarget.type == XBuildType.door || curTarget.type == XBuildType.bed) {
                            playerScript.setCurTarget(nearestBuilding)
                            return true
                        }
                        let gridPos = XMgr.mapMgr.mapPosToGridPos(target.owner.x, target.owner.y)
                        let room = XMgr.mapMgr.getRoomById(nearestBuilding.roomId)
                        for (const grid of room.grids) {
                            if (gridPos.x == grid.x && gridPos.y == grid.y && nearestBuilding.type == XBuildType.door) {
                                playerScript.setCurTarget(nearestBuilding)
                                return true;
                            }
                        }
                        return false;
                    }
                    //在同一房间
                    let room2 = XMgr.mapMgr.getRoomById(roomId)
                    let bb = XMgr.mapMgr.mapPosToGridPos(playModel.owner.x, playModel.owner.y)
                    for (const grid of room2.grids) {
                        if (bb.x == grid.x && bb.y == grid.y && nearestBuilding.type == XBuildType.door) {
                            if (!room2.players || !room2.players.length || room2.players[0].isDie || room2.players[0].isOutDoor) {
                                playerScript.setCurTarget(nearestBuilding);
                            } else if (curTarget == nearestBuilding) {
                                playerScript.setCurTarget(room2.players[0]);
                            }
                            return true;
                        }
                    }
                }
            }

            playerScript.setCurTarget(nearestBuilding)
            return true
        }
        return false
    }
}


