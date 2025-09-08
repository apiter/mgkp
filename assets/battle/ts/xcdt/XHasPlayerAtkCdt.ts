import { XBTCondition } from '../bt2/XBTCondition';
import XBTTick from '../bt2/XBTTick';
import XPlayerModel from '../model/XPlayerModel';
import { XPlayerScript } from '../view/player/XPlayerScript';
import { XBuildType } from '../xconfig/XEnum';
import XMgr from '../XMgr';

export class XHasPlayerAtkCdt extends XBTCondition {
    static NAME = "XHasPlayerAtkCdt"

    constructor(child_ = null) {
        super({
            child: child_,
            name: XHasPlayerAtkCdt.NAME,
            title: "",
            properties: null
        })
    }

    satisfy(tick_: XBTTick): boolean {
        const playerScript = tick_.target as XPlayerScript;
        const curTarget = playerScript.getCurTarget();
        const playerModel = playerScript.getDataModel();

        if (curTarget && curTarget instanceof XPlayerModel && playerScript.targetIsOK(curTarget)) {
            return true;
        }

        let targetPlayer;
        const allPlayersRd = playerScript.getAllPlayersRand();
        let pathLen = 99999;
        for (const player of allPlayersRd) {
            if (player.isDie) continue;

            if (player.roomId !== -1) {
                // 当前目标与玩家在同一个房间
                if (curTarget && playerScript.targetIsOK(curTarget) && player.roomId === curTarget.roomId) {
                    const room = XMgr.mapMgr.getRoomById(player.roomId);
                    const playerGrid = XMgr.mapMgr.mapPosToGridPos(playerModel.owner.x, playerModel.owner.y);

                    for (const grid of room.grids) {
                        if (playerGrid.x === grid.x && playerGrid.y === grid.y && curTarget.type === XBuildType.door && !player.isDie && !player.isOutDoor) {
                            playerScript.setCurTarget(player);
                            return true;
                        }
                    }
                    continue;
                }

                // 目标在其他房间，且房间门可进入
                if (player.roomId !== playerScript.getOwnerRoomId()) {
                    const roomModel = playerScript.getRoomModel(player.roomId);
                    if (roomModel && roomModel.doorModel && !roomModel.doorModel.isOpen && !roomModel.doorModel.isDie) {
                        continue;
                    }
                }
            }

            // 计算路径，选择距离最近的玩家
            const ownerPos = playerScript.getOwnerPos();
            const path = playerScript.getPath(ownerPos, playerScript.getTargetPos(player));

            if (path && path.length < pathLen) {
                pathLen = path.length;
                targetPlayer = player;
            }
        }

        if (targetPlayer) {
            playerScript.setCurTarget(targetPlayer);
            return true;
        }

        return false
    }
}


