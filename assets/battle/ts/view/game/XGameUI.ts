import { _decorator, Component, Node, Sprite, SpriteAtlas } from 'cc';
import XMgr from '../../XMgr';
import { XBuildType } from '../../xconfig/XEnum';
const { ccclass, property } = _decorator;

interface OperateBtnInfo {
    buildType: XBuildType
    gridX: number
    gridY: number
    isOpen?: boolean
}

@ccclass('XGameUI')
export class XGameUI extends Component {
    @property(SpriteAtlas)
    gameUIAtlas: SpriteAtlas = null

    @property(Node)
    operateBtn: Node = null
    @property(Sprite)
    operateImg: Sprite = null


    _operateBtnInfo: OperateBtnInfo = null

    constructor() {
        super()
        XMgr.gameUI = this
    }

    start() {
        this.operateBtn.on(Node.EventType.TOUCH_END, this.onClickOperateBtn, this)
    }

    update(deltaTime: number) {

    }

    hideOperateBtn() {
        this.operateBtn.active = false
    }

    showDoorBtn(gridX_, gridY_, isOpen_) {
        this.operateBtn.active = true
        const mapPos = XMgr.mapMgr.gridPosToMapPos(gridX_, gridY_)
        const stagePos = XMgr.mapMgr.mapPosToStagePos(mapPos.x, mapPos.y)
        this.operateBtn.x = stagePos.x
        this.operateBtn.y = stagePos.y
        this.operateImg.spriteFrame = isOpen_ ? this.gameUIAtlas.getSpriteFrame("img_kaimen") : this.gameUIAtlas.getSpriteFrame("img_guanmen")
        this._operateBtnInfo = { buildType: XBuildType.door, gridX: gridX_, gridY: gridY_, isOpen: isOpen_ }
    }

    showBedBtn(gridX_, gridY_) {
        let player = XMgr.playerMgr.player
        this.operateBtn.active = true
        this.operateImg.spriteFrame = this.gameUIAtlas.getSpriteFrame("img_shangchuang")
        const mapPos = XMgr.mapMgr.gridPosToMapPos(gridX_, gridY_)
        const stagePos = XMgr.mapMgr.mapPosToStagePos(mapPos.x, mapPos.y)
        this.operateBtn.x = stagePos.x
        this.operateBtn.y = stagePos.y
        this._operateBtnInfo = { buildType: XBuildType.bed, gridX: gridX_, gridY: gridY_, }
    }

    onClickOperateBtn() {
        this.hideOperateBtn()
        switch (this._operateBtnInfo?.buildType) {
            case XBuildType.door:
                if (this._operateBtnInfo.isOpen) {
                    XMgr.buildingMgr.openDoorByGridPos(this._operateBtnInfo.gridX, this._operateBtnInfo.gridY)
                } else {
                    XMgr.buildingMgr.closeDoorByGridPos(this._operateBtnInfo.gridX, this._operateBtnInfo.gridY)
                }
                break
            case XBuildType.bed:
                const result = XMgr.gameMgr.upBed(this._operateBtnInfo.gridX, this._operateBtnInfo.gridY, XMgr.playerMgr.mineUuid)
                break
        }
    }
}


