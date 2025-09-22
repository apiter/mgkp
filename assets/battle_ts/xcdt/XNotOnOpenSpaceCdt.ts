import { _decorator, Component, Node, v2, Vec2 } from 'cc';
import { XBTCondition } from '../bt2/XBTCondition';
import XBTTick from '../bt2/XBTTick';
import { XBuildType } from '../xconfig/XEnum';
import { XPlayerScript } from '../view/player/XPlayerScript';
import XMgr from '../XMgr';
const { ccclass, property } = _decorator;

@ccclass('XNotOnOpenSpaceCdt')
export class XNotOnOpenSpaceCdt extends XBTCondition {
    static NAME = 'XNotOnOpenSpaceCdt'
    _range
    constructor(range_, child_ = null) {
        super({
            child: child_,
            title: XNotOnOpenSpaceCdt.NAME,
            name: XNotOnOpenSpaceCdt.NAME,
            properties: null
        })
        this._range = range_
    }

    satisfy(tick_: XBTTick): boolean {
        let playerScript = tick_.target as XPlayerScript
        let playerGridPos = playerScript.getOwnerGridPos()
        let buildModel = XMgr.buildingMgr.getBuilding(playerGridPos.x, playerGridPos.y)
        if (!buildModel || buildModel.type != XBuildType.door)
            return false;
        let playerPos = playerScript.getOwnerPos(),
            curTarget = playerScript.getCurTarget(),
            targetPos = playerScript.getTargetPos(curTarget),
            range = this._range;
        targetPos && (range = Vec2.distance(v2(playerPos.x, playerPos.y), targetPos))
        return (range <= this._range - 20) && !buildModel.isOpen
    }
}


