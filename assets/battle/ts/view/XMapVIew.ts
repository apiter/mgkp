import { _decorator, Component, instantiate, Node, Prefab, Sprite, SpriteAtlas, UITransform } from 'cc';
import { XBattleEntrance } from 'db://assets/XBattleEntrance';
import XMgr from '../XMgr';
import { XConst } from '../xconfig/XConst';
const { ccclass, property } = _decorator;

@ccclass('XGroundView')
export class XGroundView extends Component {
    @property(SpriteAtlas)
    mapAtlas: SpriteAtlas = null

    @property(Prefab)
    groundCellPrefab: Prefab = null

    @property(Node)
    groundLayer: Node = null

    protected onLoad(): void {
    }

    async start() {
        await XBattleEntrance.loadRes()

        const width = XMgr.mapMgr.width
        const height = XMgr.mapMgr.height
        this.groundLayer.getComponent(UITransform).setContentSize((XConst.GridSize + 1) * width, (XConst.GridSize + 1) * height)
        
        this.createGround()
    }

    private createGround() {
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


