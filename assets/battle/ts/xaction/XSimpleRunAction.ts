import { _decorator, Component, game, Node, Vec2 } from 'cc';
import XBTAction from '../bt2/XBTAction';
import { XBTCategory, XBTStatus } from '../bt2/XBTEnum';
import XMgr from '../XMgr';
import { XV2Util01 } from '../xutil/XV2Util01';
const { ccclass, property } = _decorator;

@ccclass('XSimpleRunAction')
export class XSimpleRunAction extends XBTAction {
    static NAME = "XSimpleRunAction"

    atkIntervalTs = 0
    constructor() {
        super({
            name:XSimpleRunAction.NAME,
            properties:null
        })
    }

    open(e) {
    }

    tick(tick_) {
        let target = tick_.target,
            curPath = target.getCurPath();
        if (!curPath || curPath.length < 2) 
            return XBTStatus.SUCCESS;
        let targetModelData = target.data,
            attackCd = target.getAttackCd(),
            now = game.totalTime;
        if (now - this.atkIntervalTs >= 1e3 * attackCd) {
            this.atkIntervalTs = now;
            let pt1 = curPath[1],
                grid1 = XMgr.mapMgr.mapPosToGridPos(pt1.x, pt1.y),
                building1 = XMgr.buildingMgr.getBuilding(grid1.x, grid1.y),
                pt2 = curPath[0],
                grid2 = XMgr.mapMgr.mapPosToGridPos(pt2.x, pt2.y),
                building2 = XMgr.buildingMgr.getBuilding(grid2.x, grid2.y);
            if (building2) {
                if (XV2Util01.pDistance(new Vec2(targetModelData.owner.x, targetModelData.owner.y), new Vec2(building2.owner.x, building2.owner.y)) <= target.getAttackRange()) 
                    return target.attack(building2), XBTStatus.FAILURE
            }
            if (building1) {
                if (XV2Util01.pDistance(new Vec2(targetModelData.owner.x, targetModelData.owner.y), new Vec2(building1.owner.x, building1.owner.y)) <= target.getAttackRange()) 
                    return target.attack(building1), XBTStatus.FAILURE
            }
        }
        return XBTStatus.SUCCESS
    }
}

XSimpleRunAction.register("XSimpleRunAction", XBTCategory.ACTION)

