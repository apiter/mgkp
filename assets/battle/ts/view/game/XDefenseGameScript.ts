import { _decorator, Canvas, Component, EventTouch, game, Node, UITransform, v2, v3 } from 'cc';
import { XGameScript } from './XGameScript';
import XMgr from '../../XMgr';
import LogWrapper, { XLogModule } from '../../log/LogWrapper';
const { ccclass, property } = _decorator;

@ccclass('XDefenseGameScript')
export class XDefenseGameScript extends XGameScript {
    onInit(): void {
        super.onInit()
    }

    onClickMap(touch: EventTouch) {
        // if (!XMgr.playerMgr.player.isBed) return;

        // const localPt = this.node.getComponent(UITransform).convertToNodeSpaceAR()
        // const worldPt = this.node.getComponent(UITransform).convertToWorldSpaceAR(localPt)

        // const mapParent = XMgr.mapMgr.mapNode.parent
        const mapTransform = XMgr.mapMgr.mapNode.getComponent(UITransform)
        const mapPos = mapTransform.convertToNodeSpaceAR(v3(touch.getUILocation().x, touch.getUILocation().y, 0))
        // const mapPos = v2(mapParentPos.x + (0.5) * mapTransform.width, mapParentPos.y - (0.5) * mapTransform.height)
        // const mapPos = XMgr.mapMgr.stagePosToMapPos(stagePos.x, stagePos.y)
        const gridPos = XMgr.mapMgr.mapPosToGridPos(mapPos.x, mapPos.y)
        const room = XMgr.mapMgr.getRoomByGridPos(gridPos.x, gridPos.y)
        console.log(`touchX:${touch.getLocationX()} touchY:${touch.getLocationY()}`)
        LogWrapper.log(`点击地图`, `mapPos:${mapPos.toString()} Grid:(${gridPos.toString()}) 房间:${room?.id}`, {}, [XLogModule.XLogMuduleTemp])
        if (!room || !room.players || !room.players.length) return;

        let canHandle = XMgr.mapMgr.canHandleGrid(gridPos.x, gridPos.y);
        if (!canHandle) {
            return XMgr.gameUI.hideAllMenu()
        }
        let building = XMgr.buildingMgr.getBuilding(gridPos.x, gridPos.y);
        if (building && (canHandle)) {
            XMgr.gameUI.showUpgradeMeun(gridPos.x, gridPos.y, building)
        } else if (canHandle) {
            XMgr.gameUI.showBuildMeun(gridPos.x, gridPos.y)
        }
    }
}


