import { _decorator, Component, Node, v2, Vec2, Vec3 } from 'cc';
import { XBTCondition } from '../bt2/XBTCondition';
import XBTTick from '../bt2/XBTTick';
import { XPlayerScript } from '../view/player/XPlayerScript';
import XMgr from '../XMgr';
const { ccclass, property } = _decorator;

@ccclass('XHasPlayerAroundCdt')
export class XHasPlayerAroundCdt extends XBTCondition {
    static NAME = "XHasPlayerAroundCdt"
    constructor(child_ = null) {
        super({
            child: child_,
            name: XHasPlayerAroundCdt.NAME,
            properties: null,
            title: ""
        })
    }

    satisfy(data_: XBTTick): boolean {
        const playerScript = data_.target as XPlayerScript

        const allPlayersRd = playerScript.getAllPlayersRand()
        const ownerPos = playerScript.getOwnerPos()
        for (const player of allPlayersRd) {
            if (player.isDie)
                continue
            if (player.uuid == XMgr.playerMgr.mineUuid)
                continue
            const dis = Vec2.squaredDistance(v2(ownerPos.x, ownerPos.y), playerScript.getTargetPos(player))
            if (dis < 10000) {
                playerScript.setCurTarget(player)
                return true
            }
        }
        return false
    }
}


