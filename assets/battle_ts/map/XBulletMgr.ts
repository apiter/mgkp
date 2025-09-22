import { Node, Sprite } from "cc";
import XAtlasLoader from "db://assets/XAtlasLoader";

export default class XBulletMgr {
    _bulletMaps: { [key: string]: Node[] } = {}
    _bulletLayer: Node = null

    init(bulletLayer_: Node) {
        this._bulletLayer = bulletLayer_
        this._bulletMaps = {}
    }

    createBulletNode(resPath_) {
        let bulletNode: Node;
        if ( this._bulletMaps[resPath_]?.length > 0) {
            bulletNode = this._bulletMaps[resPath_].pop();
        }
        else {
            bulletNode = new Node('bullet')
            const bulletImageNode = new Node(resPath_)
            const sprite = bulletImageNode.addComponent(Sprite)
            sprite.trim = true
            sprite.sizeMode = Sprite.SizeMode.TRIMMED
            bulletNode.addChild(bulletImageNode)
            XAtlasLoader.asyncFetchSpriteFrame(resPath_).then((sf) => {
                sprite.isValid && (sprite.spriteFrame = sf)
            })
        }
        bulletNode.active = true
        this._bulletLayer?.addChild(bulletNode)
        return bulletNode
    }

    recycleBulletNode(resPath_, bulletNode_: Node) {
        !this._bulletMaps[resPath_] && (this._bulletMaps[resPath_] = [])
        if (this._bulletMaps[resPath_].indexOf(bulletNode_) < 0) {
            this._bulletMaps[resPath_].push(bulletNode_)
            bulletNode_.active = false
        }
    }
}


