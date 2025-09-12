import { _decorator, Component, Node, Sprite, SpriteAtlas } from 'cc';
import XMgr from '../../XMgr';
const { ccclass, property } = _decorator;

@ccclass('XGameUI')
export class XGameUI extends Component {
    @property(SpriteAtlas)
    gameUIAtlas: SpriteAtlas = null

    @property(Node)
    operateBtn: Node = null
    @property(Sprite)
    operateImg: Sprite = null

    constructor() {
        super()
        XMgr.gameUI = this
    }

    start() {

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
    }
}


