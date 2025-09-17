import { _decorator, Component, director, instantiate, log, math, Node, Prefab, Sprite, SpriteAtlas, tween, UIOpacity, UITransform, v2, v3, Vec2, Vec3, view } from 'cc';
import { XBattleEntrance } from 'db://assets/XBattleEntrance';
import XMgr from '../XMgr';
import { XConst } from '../xconfig/XConst';
const { ccclass, property } = _decorator;

@ccclass('XMapView')
export class XMapView extends Component {
    @property(SpriteAtlas)
    mapAtlas: SpriteAtlas = null
    @property(SpriteAtlas)
    gameAtlas: SpriteAtlas = null

    @property(Prefab)
    groundCellPrefab: Prefab = null

    @property(Node)
    groundLayer: Node = null
    @property(Node)
    buildLayer: Node = null
    @property(Node)
    buildMoveLayer: Node = null
    @property(Node)
    playerLayer: Node = null
    @property(Node)
    hunterLayer: Node = null
    @property(Node)
    bulletLayer: Node = null
    @property(Node)
    barLayer: Node = null

    lookPos = v2(0)

    _buildTipsList: Node[][] = []
    _doorTipsList: Node[][] = []
    upTipsList: Node[][] = []

    init() {
        const cellCntW = XMgr.mapMgr.width
        const cellCntH = XMgr.mapMgr.height
        const pixelW = (XConst.GridSize) * cellCntW
        const pixelH = (XConst.GridSize) * cellCntH
        this.node.getComponent(UITransform).setContentSize(pixelW, pixelH)
        this.groundLayer.getComponent(UITransform).setContentSize(pixelW, pixelH)
        this.buildLayer.getComponent(UITransform).setContentSize(pixelW, pixelH)
        this.buildMoveLayer.getComponent(UITransform).setContentSize(pixelW, pixelH)
        this.playerLayer.getComponent(UITransform).setContentSize(pixelW, pixelH)
        this.hunterLayer.getComponent(UITransform).setContentSize(pixelW, pixelH)
        this.bulletLayer.getComponent(UITransform).setContentSize(pixelW, pixelH)
        this.barLayer.getComponent(UITransform).setContentSize(pixelW, pixelH)

        XMgr.mapMgr.barLayer = this.barLayer

        this.createGround()
    }

    private createGround() {
        //TODO visible only
        const width = XMgr.mapMgr.width
        const height = XMgr.mapMgr.height
        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                const tiledInfo = XMgr.mapMgr.getTiledInfo(h, w)
                if (tiledInfo.groundBlock) {
                    const groundNode = instantiate(this.groundCellPrefab)
                    groundNode.name = `ground_${h}_${w}`
                    groundNode.setPosition((w + 0.5) * XConst.GridSize, -(h + 0.5) * XConst.GridSize)
                    const sp = groundNode.getComponent(Sprite)
                    sp.spriteFrame = this.mapAtlas.getSpriteFrame(tiledInfo.groundBlock)
                    groundNode.parent = this.groundLayer
                }
            }
        }
    }

    lookAt(worldX, worldY) {
        const row = XMgr.gameMgr.mapCfg.row
        const column = XMgr.gameMgr.mapCfg.column;

        // 2. 获取屏幕中心在世界坐标中的位置
        const uiTransform = director.getScene().getComponentInChildren(UITransform);
        if (!uiTransform) return;

        const screenLeftUp = new Vec3(0, 0, 0);
        const screenLeftUpWorld = new Vec3();
        uiTransform.convertToWorldSpaceAR(screenLeftUp, screenLeftUpWorld);

        const offset = screenLeftUpWorld.subtract(v3(worldX, worldY));
        this.node.worldPosition = this.node.worldPosition.add(offset);
        const localX = math.clamp(this.node.x, -this.node.getComponent(UITransform).contentSize.width + view.getVisibleSize().width * 0.5, -view.getVisibleSize().width * 0.5)
        const localY = math.clamp(this.node.y, view.getVisibleSize().height * 0.5, this.node.getComponent(UITransform).contentSize.height - view.getVisibleSize().height * 0.5)
        this.node.x = localX
        this.node.y = localY

        this.updateArea()
    }

    move(deltaX, deltaY) {
        let newX = this.node.x + deltaX
        let newY = this.node.y + deltaY
        newX = math.clamp(newX, -this.node.getComponent(UITransform).contentSize.width + view.getVisibleSize().width * 0.5, -view.getVisibleSize().width * 0.5)
        newY = math.clamp(newY, view.getVisibleSize().height * 0.5, this.node.getComponent(UITransform).contentSize.height - view.getVisibleSize().height * 0.5)
        this.node.x = newX
        this.node.y = newY

        this.updateArea()
    }

    updateArea() {

    }

    showBuildTips(gridX_, gridY_) {
        // 初始化行数组
        if (!this._buildTipsList[gridX_]) {
            this._buildTipsList[gridX_] = [];
        }

        // 已经有提示图标：重新显示并播放动画
        if (this._buildTipsList[gridX_][gridY_]) {
            let tip = this._buildTipsList[gridX_][gridY_];
            tip.active = true;
        } else {
            let tipNode = new Node("buildTip")
            let spr = tipNode.addComponent(Sprite)
            spr.spriteFrame = this.gameAtlas.getSpriteFrame("img_buildTips")
            let uiOpacity = tipNode.addComponent(UIOpacity)

            this.groundLayer.addChild(tipNode);
            tipNode.x = (gridY_ + 0.5) * XConst.GridSize
            tipNode.y = -(gridX_ + 0.5) * XConst.GridSize
            uiOpacity.opacity = 255
            this._buildTipsList[gridX_][gridY_] = tipNode;
            // tween(uiOpacity).repeatForever(tween(uiOpacity).to(1, { opacity: 255 }).to(1, { opacity: 0 })).start()

            this._buildTipsList[gridX_][gridY_].on(Node.EventType.TOUCH_END, () => {
                XMgr.gameUI.showBuildMeun(gridX_, gridY_)
            }, this)
        }

    }

    hideBuildTips(gridX_, gridY_) {
        if (this._buildTipsList[gridX_] && this._buildTipsList[gridX_][gridY_]) {
            this._buildTipsList[gridX_][gridY_].active = false
        }
    }

    clearBuilTips(gridX_, gridY_) {
        this._buildTipsList[gridX_] && this._buildTipsList[gridX_][gridY_] &&
            (this._buildTipsList[gridX_][gridY_].destroy(),
                this._buildTipsList[gridX_][gridY_] = null)
    }

    hideAllBuildTips() {
        for (const room of XMgr.mapMgr.rooms)
            for (const grid of room.grids) {
                this.hideBuildTips(grid.x, grid.y)
            }
    }

    createDoorTips(gridX_: number, gridY_: number, rotation_: number) {
        this._doorTipsList[gridX_] || (this._doorTipsList[gridX_] = [])
        if (this._doorTipsList[gridX_][gridY_]) return;
        let tipNode = new Node("buildTip")
        let spr = tipNode.addComponent(Sprite)
        spr.spriteFrame = this.gameAtlas.getSpriteFrame("img_doorTips")
        this.buildLayer.addChild(tipNode)
        let uiOpacity = tipNode.addComponent(UIOpacity)
        tipNode.x = (gridY_ + 0.5) * XConst.GridSize
        tipNode.y = -(gridX_ + 0.5) * XConst.GridSize
        tipNode.angle = -rotation_
        uiOpacity.opacity = 0
        this._doorTipsList[gridX_][gridY_] = tipNode;

        tween(uiOpacity).repeatForever(tween(uiOpacity).to(1, { opacity: 255 }).to(1, { opacity: 0 })).start()
    }

    removeDoorTips(gridX_: number, gridY_: number) {
        this._doorTipsList[gridX_] && this._doorTipsList[gridX_][gridY_] && this._doorTipsList[gridX_][gridY_].destroy()
        this._doorTipsList[gridX_][gridY_] = null
    }

    showUpTips(gridX_, gridY_, isMyBuilding_ = true) {
        this.upTipsList[gridX_] || (this.upTipsList[gridX_] = []);
        let upTipNode = this.upTipsList[gridX_][gridY_];
        if (!upTipNode) {
            upTipNode = instantiate(XMgr.prefabMgr.pf_upgradetip_01)
            this.hunterLayer.addChild(upTipNode)
            upTipNode.x = (gridY_ + 0.5) * XConst.GridSize
            upTipNode.y = -(gridX_ + 0.5) * XConst.GridSize

            const tip_bg_node = upTipNode.children[0]

            const uiOpacity = tip_bg_node.getComponent(UIOpacity)
            uiOpacity.opacity = 0

            tween(uiOpacity).repeatForever(tween(uiOpacity).to(1, { opacity: 255 }).to(1, { opacity: 0 })).start()

            const tip_arrow_node = upTipNode.children[1]
            tween(tip_arrow_node).repeatForever(tween(tip_arrow_node).to(1, { y: -16 }).to(1, { y: 16 })).start()

            this.upTipsList[gridX_][gridY_] = upTipNode
        }

        upTipNode.active = true
    }
}


