import { _decorator, Component, game, Node, v3, Vec3 } from 'cc';
import XMgr from '../../XMgr';
import XPlayerModel from '../../model/XPlayerModel';
import { XConst } from '../../xconfig/XConst';
import { XV2Util01 } from '../../xutil/XV2Util01';
import XBuildingModel from '../../model/XBuildingModel';
const { ccclass, property } = _decorator;

@ccclass('XBulletScript')
export class XBulletScript extends Component {
    _speed = 1000
    _maxDistSquared = 1e6
    _isActive = false
    _originPos: Vec3 = null
    _moveDir: Vec3 = null
    _bulletKey = ""
    _damage = 0
    _target: XPlayerModel
    _baseModel: XBuildingModel

    _disArriveAtTarget = 25
    protected onLoad(): void {
        this._speed = XMgr.cfg.constant.bulletSpeed
        this._speed /= XMgr.gameMgr.speedRatio
    }

    public shoot(bulletKey_, damage_, moveDir_, target_: XPlayerModel, baseModel_) {
        this._bulletKey = bulletKey_
        this._damage = damage_
        this._moveDir = moveDir_ || v3(0)
        this._target = target_
        this._baseModel = baseModel_

        this._isActive = true
        this.node.angle = 0
        this._originPos = this.node.getPosition()
    }

    update(deltaTime: number) {
        if (!this._isActive)
            return
        if (this._target && (this._target.isDie || !this._target.owner.isValid))
            return this.recycle()
        if (this._target) {
            let targetWorldPos = this._target.owner.worldPosition.clone()
            targetWorldPos = targetWorldPos.add3f(0, XConst.GridHalfSize, 0)
            let bulletWorldPos = this.node.worldPosition
            this._moveDir.set(targetWorldPos.x - bulletWorldPos.x, targetWorldPos.y - bulletWorldPos.y, 0)
            XV2Util01.faceToCC(this.node, targetWorldPos.x, targetWorldPos.y, -90)

            const dis = Vec3.distance(bulletWorldPos, targetWorldPos)
            if (dis <= this._disArriveAtTarget) {
                this.onCollision()
                return
            }
        }

        const dt = game.deltaTime
        this._moveDir.normalize().multiplyScalar(this._speed * dt)
        this.node.x += this._moveDir.x
        this.node.y += this._moveDir.y
    }

    recycle() {
        this._isActive = false
        XMgr.bulletMgr.recycleBulletNode(this._bulletKey, this.node)
    }

    onCollision() {
        this.recycle()
        XMgr.gameMgr.takeDamage(this._baseModel, this._target, this._damage)
    }
}


