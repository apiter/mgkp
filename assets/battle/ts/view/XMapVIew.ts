import { _decorator, Component, instantiate, Node, Prefab, Sprite, SpriteAtlas, UITransform } from 'cc';
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
    playerLayer:Node = null

    init() {
        const width = XMgr.mapMgr.width
        const height = XMgr.mapMgr.height
        this.node.getComponent(UITransform).setContentSize((XConst.GridSize + 1) * width, (XConst.GridSize + 1) * height)
        this.groundLayer.getComponent(UITransform).setContentSize((XConst.GridSize + 1) * width, (XConst.GridSize + 1) * height)
        this.buildLayer.getComponent(UITransform).setContentSize((XConst.GridSize + 1) * width, (XConst.GridSize + 1) * height)
        this.buildMoveLayer.getComponent(UITransform).setContentSize((XConst.GridSize + 1) * width, (XConst.GridSize + 1) * height)
        this.playerLayer.getComponent(UITransform).setContentSize((XConst.GridSize + 1) * width, (XConst.GridSize + 1) * height)

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
}


