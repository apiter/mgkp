import { _decorator, Component, Node, Sprite, Tween, tween, v2, Vec2 } from 'cc';
import { XBuildingScript } from './XBuildingScript';
import XAtlasLoader from 'db://assets/XAtlasLoader';
import { XConst } from '../../xconfig/XConst';
import XMgr from '../../XMgr';
import { XGameStatus, XPlayerType } from '../../xconfig/XEnum';
const { ccclass, property } = _decorator;

@ccclass('XDoorScript')
export class XDoorScript extends XBuildingScript {

    open = false
    originX = 0
    originY = 0

    get moveMod() {
        let e = Math.abs(this.data.rotation);
        return 0 == e || 180 == e
    }

    async initSkin() {
        this.iconNode = new Node("iconNode")
        this._skinSprite = this.iconNode.addComponent(Sprite)
        this._skinSprite.spriteFrame = await XAtlasLoader.asyncFetchSpriteFrame(this.cfg.icon)
        this._skinSprite.trim = true
        this._skinSprite.sizeMode = Sprite.SizeMode.TRIMMED
        this.skinNode.addChild(this.iconNode);

        this.originX = this.node.x
        this.originY = this.node.y

        this.data.isOpen && this.openDoor()
    }

    onInit(): void {

    }

    openDoor() {
        if (!this.open && this.data.canHandle) {
            this.open = true;

            Tween.stopAllByTarget(this.node)
            this.unschedule(this.checkAutoClose)
            this.scheduleOnce(this.checkAutoClose, 3)

            // 门的开启动画
            if (this.moveMod) {
                tween(this.node).to(0.3, { x: this.originX + XConst.GridSize }).start()
            } else {
                tween(this.node).to(0.3, { y: this.originY + XConst.GridSize }).start()
            }
        }
    }

    closeDoor() {
        if (!this.data.canHandle) return;
        if (!this.open) return;
        this.open = false
        this.unschedule(this.checkAutoClose)
        Tween.stopAllByTarget(this.node)
        this.moveMod ? tween(this.node).to(0.3, { x: this.originX }).start() : tween(this.node).to(0.3, { y: this.originY }).start();
        let player = XMgr.playerMgr.player,
            hunters = XMgr.playerMgr.hunters,
            huntersAndMe = [player];
        XMgr.gameMgr.gameStatus == XGameStatus.E_GAME_START && (huntersAndMe = huntersAndMe.concat(hunters));
        for (const player of huntersAndMe) {
            let s = v2(player.owner.x, player.owner.y),
                a = v2(this.originX, this.originY);
            if (Vec2.squaredDistance(s, a) < 11236 && -1 != player.roomId && XMgr.gameMgr.mineRoom) {
                //TODO 如果玩家在门口
            }
        }
    }

    checkAutoClose() {
        XMgr.gameMgr.isRoomBedUsed(this.data.roomId) && XMgr.buildingMgr.closeDoorByGridPos(this.data.x, this.data.y)
    }
}


