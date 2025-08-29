import { _decorator, Component, Node, sp, UITransform, v2, v3, Vec2 } from 'cc';
import { Direction as XDirection, XPlayerType, XSkinType } from '../../xconfig/XEnum';
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
    moveSpeedScale = 1
    moveSpeed = 100

    isAtking = false

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
            spineNode.setPosition(v3(0, -XConst.GridHalfSize + 30))
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
        this.spineNode.getComponent(sp.Skeleton).animation = aniName_
    }


    onHpChanged() {

    }

    onDead() {

    }

    idle() {

    }

    pos(x_, y_) {
        if (this.lastMovePos) {
            this.lastMovePos.set(this.node.x, this.node.y);
        } else {
            this.lastMovePos = new Vec2(this.node.x, this.node.y);
        }

        const preWorld = this.node.worldPosition
        // 移动节点
        this.node.x = x_;
        this.node.y = y_;
        const afterWorld = this.node.worldPosition

        // 更新房间 ID
        this.data.roomId = XMgr.mapMgr.getRoomIdByMapPos(x_, y_);
    }

    move(deltaX_, deltaY_, limit_ = true) {
        // 如果当前不能移动 或者处于控制状态，就直接 return
        if (!this.canMove || this.control) return;

        // 如果 a 为 true，调用限制移动的方法（可能带碰撞检测/边界限制）
        // 否则就是普通移动
        let nextPos = limit_ ? XMgr.mapMgr.limitMove(this.node.x, this.node.y, deltaX_, deltaY_, 16)
            : XMgr.mapMgr.move(this.node.x, this.node.y, deltaX_, deltaY_, 16);

        // 更新位置
        this.pos(nextPos.x, nextPos.y);

        // 根据 i (横向输入) 设置朝向
        if (deltaX_ > 0) {
            this.setFace(1);   // 面向右
        } else if (deltaX_ < 0) {
            this.setFace(-1);  // 面向左
        }

        // 设置方向 (上下左右)
        if (Math.abs(deltaX_) > Math.abs(deltaY_)) {
            this.direction = deltaX_ > 0 ? XDirection.Right : XDirection.Left;
        } else if (Math.abs(deltaX_) < Math.abs(deltaY_)) {
            this.direction = deltaY_ > 0 ? XDirection.Down : XDirection.Up;
        }

        // 播放跑步动画
        this.playAnim("move");
    }

    setFace(t) {
        this.faceDir = t;

        if (this.data.type == XPlayerType.E_Defender) {
            // 防守者：皮肤镜像翻转，建筑保持一致

        } else if (this.data.type == XPlayerType.E_Hunter) {

        }
    }
}


