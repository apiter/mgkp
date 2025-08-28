import { _decorator, Component, instantiate, log, math, Node, Prefab, Sprite, SpriteAtlas, UITransform, v2, v3, Vec2, view } from 'cc';
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
        //TODO in view only
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
        worldX += view.getVisibleSize().width * 0.5 
        worldY -= view.getVisibleSize().height * 0.5 
        const localPt = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(v3(worldX, worldY, 0))
        const localX = math.clamp(-localPt.x, -column * XConst.GridSize + view.getVisibleSize().width * 0.5, -view.getVisibleSize().width * 0.5) //Math.max(0, Math.min(row * XConst.GridSize, localPt.x))
        const localY = math.clamp(-localPt.y, view.getVisibleSize().height * 0.5, row * XConst.GridSize - view.getVisibleSize().height * 0.5)// Math.max(0, Math.min(-column * XConst.GridSize, localPt.y))
        // this.lookPos.set(localX, localY)
        this.node.x = localX
        this.node.y = localY
        console.debug(`map look at:(${localX}, ${localY})`)
    }

    updateArea() {

    }
}


