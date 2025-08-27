import { _decorator, Component, Node, sp, UITransform, v2, v3, Vec2 } from 'cc';
import { Direction as XDirection, XSkinType } from '../../xconfig/XEnum';
import XPlayerModel from '../../model/XPlayerModel';
import { XEventNames } from '../../event/XEventNames';
import { XConst } from '../../xconfig/XConst';
import XMgr from '../../XMgr';
import { XCfgSkinData } from '../../xconfig/XCfgData';
import XUtil from '../../xutil/XUtil';
import XResUtil from '../../xutil/XResUtil';
const { ccclass, property } = _decorator;

@ccclass('XPlayerScript')
export class XPlayerScript extends Component {
    faceDir = 1
    moveSpeedScale = 1
    canMove = true
    control = false
    direction = XDirection.Left
    isEscaped = false
    isSkinLoaded = false
    atkIntervalTs = 0
    isFirstFind = true
    getPathCd = false

    data: XPlayerModel = null

    skinNode: Node = null
    aniNode: Node = null
    spineNode: Node = null
    skinCfg: XCfgSkinData = null

    lastMovePos: Vec2 = null

    start() {

    }

    init(data_: XPlayerModel) {
        this.data = data_
        data_.ownerScript = this
        data_.owner = this.node

        this.skinNode = new Node
        this.skinNode.name = "skinNode"
        let uiTrans = this.skinNode.addComponent(UITransform)
        uiTrans.setContentSize(XConst.GridSize, XConst.GridSize)
        this.node.addChild(this.skinNode)
        this.node.on(XEventNames.Hp_Changed, this.onHpChanged, this)

        this.loadSkin()
    }

    async loadSkin() {
        this.skinCfg = XMgr.cfg.skin.get(this.data.skinId + "");

        // 1. 床的图片
        if (this.skinCfg.skinBedPath) {
        }

        // 2. spine 动画资源（.bin 格式）
        if (this.skinCfg.skinPath.includes(".bin")) {
            const path = this.skinCfg.skinPath.replace(".bin", "")
            this.aniNode = new Node("aniNode")
            const uiTrans = this.aniNode.addComponent(UITransform)
            uiTrans.setContentSize(XConst.GridSize, XConst.GridSize)
            uiTrans.anchorPoint = v2(0.5, 0.9)
            this.skinNode.addChild(this.aniNode);

            const spineNode = await XResUtil.loadSpineFromBundle("spines", path);
            this.aniNode.addChild(spineNode)
            spineNode.setPosition(v3(0, -XConst.GridHalfSize + 15))
            this.spineNode = spineNode
            spineNode.getComponent(sp.Skeleton).premultipliedAlpha = false

            switch (this.skinCfg.type) {
                case XSkinType.Human:
                    spineNode.scale = v3(0.275, 0.275, 1)
                    break
                case XSkinType.Hunter:
                    spineNode.scale = v3(0.5, 0.5, 1)
                    break
                case XSkinType.Angel:
                    spineNode.scale = v3(0.275, 0.275, 1)
                    break
                case XSkinType.Fighter:
                    spineNode.scale = v3(1, 1, 1)
                    break
                default:

            }
            this.isSkinLoaded = true;
            this.playAnim("idle")
        } else {
            // 3. 静态图片皮肤
        }
    }

    playAnim(aniName_, reStart_ = false, callback_ = null) {
        this.spineNode.getComponent(sp.Skeleton).animation = "idle"
    }


    onHpChanged() {

    }

    onDead() {

    }

    pos(x_, y_) {
        if (this.lastMovePos) {
            this.lastMovePos.set(this.node.x, this.node.y);
        } else {
            this.lastMovePos = new Vec2(this.node.x, this.node.y);
        }

        // 移动节点
        this.node.x = x_;
        this.node.y = y_;

        // 更新房间 ID
        this.data.roomId = XMgr.mapMgr.getRoomIdByMapPos(x_, y_);
    }

}


