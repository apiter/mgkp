import { _decorator, Component, director, instantiate, log, math, Node, Prefab, Sprite, SpriteAtlas, UITransform, v2, v3, Vec2, Vec3, view } from 'cc';
import { XBattleEntrance } from 'db://assets/XBattleEntrance';
import XMgr from '../XMgr';
import { XConst } from '../xconfig/XConst';
const { ccclass, property } = _decorator;

@ccclass('XMapView')
export class XMapView extends Component {
    @property(SpriteAtlas)
    mapAtlas: SpriteAtlas = null

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

    lookPos = v2(0)

    init() {
        const width = XMgr.mapMgr.width
        const height = XMgr.mapMgr.height
        this.node.getComponent(UITransform).setContentSize((XConst.GridSize + 1) * width, (XConst.GridSize + 1) * height)
        this.groundLayer.getComponent(UITransform).setContentSize((XConst.GridSize + 1) * width, (XConst.GridSize + 1) * height)
        this.buildLayer.getComponent(UITransform).setContentSize((XConst.GridSize + 1) * width, (XConst.GridSize + 1) * height)
        this.buildMoveLayer.getComponent(UITransform).setContentSize((XConst.GridSize + 1) * width, (XConst.GridSize + 1) * height)
        this.playerLayer.getComponent(UITransform).setContentSize((XConst.GridSize + 1) * width, (XConst.GridSize + 1) * height)
        this.hunterLayer.getComponent(UITransform).setContentSize((XConst.GridSize + 1) * width, (XConst.GridSize + 1) * height)

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
                    let color = sp.color.clone()
                    color.a = tiledInfo.walkable? 100: 255
                    sp.color = color
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
    }

    updateArea() {

    }
}


