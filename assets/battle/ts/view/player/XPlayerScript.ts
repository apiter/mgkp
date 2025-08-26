import { _decorator, Component, Node, sp, UITransform, v2, v3 } from 'cc';
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
    skinAniNode: Node = null
    spineNode: Node = null
    skinCfg: XCfgSkinData = null
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
            this.skinAniNode = new Node("aniNode")
            this.skinAniNode.name = "aniNode";
            const uiTrans = this.skinAniNode.addComponent(UITransform)
            uiTrans.setContentSize(XConst.GridSize, XConst.GridSize)
            uiTrans.anchorPoint = v2(0.5, 0.1)
            this.skinNode.addChild(this.skinAniNode);

            const spineNode = await XResUtil.loadSpineFromBundle("spine", this.skinCfg.skinPath);
            this.skinAniNode.addChild(spineNode)
            spineNode.setPosition(v3(XConst.GridHalfSize, -XConst.GridSize - 15))
            this.spineNode = spineNode

            switch (this.skinCfg.type) {
                case XSkinType.Human:
                    spineNode.scale = v3(0.275)
                    break
                case XSkinType.Hunter:
                    spineNode.scale = v3(0.5)
                    break
                case XSkinType.Angel:
                    spineNode.scale = v3(0.275)
                    break
                case XSkinType.Fighter:
                    spineNode.scale = v3(1)
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
}


