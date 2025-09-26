import { _decorator, Component, game, Node, tween, v3, Vec2 } from 'cc';
import { XBuildingScript } from './XBuildingScript';
import XTowerModel from '../../model/XTowerModel';
import XMgr from '../../XMgr';
import { XGameStatus } from '../../xconfig/XEnum';
import { XConst } from '../../xconfig/XConst';
import XPlayerModel from '../../model/XPlayerModel';
import { XBulletScript } from './XBulletScript';
import { XV2Util01 } from '../../xutil/XV2Util01';
import { XEventNames } from '../../event/XEventNames';
const { ccclass, property } = _decorator;

@ccclass('XTowerBaseScript')
export class XTowerBaseScript extends XBuildingScript {

    _towerData: XTowerModel = null
    canAttack = true
    lastAtkTime = 0;
    isWork = false
    atkTarget: XPlayerModel = null

    init(buildModel_, cdTime_?: number): void {
        super.init(buildModel_, cdTime_)
        this._towerData = this.data as XTowerModel
    }

    getAtkCD() {
        let cd = this._towerData.getAtkCD()

        return Math.max(0.2, cd) * 1000
    }

    getAtkDstSqu() {
        let atkDst = this._towerData.getAtkDst();
        let result = atkDst;
        let px = result * XConst.GridSize;
        return px * px;
    }

    getTargetDstSqu() {
        let minDstSqu = Infinity;
        let hunters = XMgr.playerMgr.hunters;
        let atkDstSqu = this.getAtkDstSqu();

        for (const h of hunters) {
            if (h.isDie) continue;
            // if (h.changeSideUuid == this.data.playerUuid) continue;

            let owner = h.owner;
            if (owner && this.node) {
                let dst = XV2Util01.pDistanceSquared(owner, this.node);
                if (dst <= atkDstSqu && dst < minDstSqu) {
                    minDstSqu = dst;
                }
            }
        }

        return minDstSqu;
    }
    
    findTarget() {
        let target: XPlayerModel, minDis = 1 / 0,
            atkDstSqu = this.getAtkDstSqu(),
            hunters = XMgr.playerMgr.hunters;
        for (const hunter of hunters) {
            if (hunter.isDie) continue;
            let hunterNode = hunter.owner;
            if (!hunterNode || !hunterNode.isValid) continue;
            let dis = XV2Util01.pDistanceSquared(hunterNode, this.node);
            dis <= atkDstSqu && dis < minDis && (minDis = dis, target = hunter)
        }
        return target
    }

    findTargets() {
        let list: XPlayerModel[] = [];
        let minDstSqu = Infinity;
        let atkDstSqu = this.getAtkDstSqu();
        let hunters = XMgr.playerMgr.hunters;

        for (const hunter of hunters) {
            if (hunter.isDie) continue;
            // if (h.changeSideUuid == this.data.playerUuid) continue;

            let owner = hunter.owner;
            if (!owner || !owner.isValid) continue;

            let dst = XV2Util01.pDistanceSquared(owner, this.node);

            if (dst <= atkDstSqu) {
                if (dst < minDstSqu) {
                    minDstSqu = dst;
                    list.unshift(hunter); // 放到最前面
                } else {
                    list.push(hunter);
                }
            }
        }

        if (list.length > 1) {
            let player = XMgr.playerMgr.getPlayer(this.data.playerUuid);
            if (player) {
                for (const b of player.buildings) {
                    if (b.id == 6022) {
                        return list; // 特殊建筑支持群攻
                    }
                }
            }
            // 默认只保留第一个目标
            list.splice(1);
        }

        return list;
    }

    protected update(dt: number): void {
        super.update?.(dt)
        
        if(XMgr.gameMgr.gameStatus !== XGameStatus.E_GAME_START) return
        if (this.canAttack == false) return
        if (this.isBuildCd) return
        let now = game.totalTime;
        if (now - this.lastAtkTime > this.getAtkCD()) {
            this.lastAtkTime = now
            this.tryAttack()
        }
    }

    tryAttack() {

    }

    getDamageMult() {
        return 1
    }

    getAtkDamage() {
        return this.cfg.atkDamage * this.getDamageMult()
    }

    fire(target: XPlayerModel) {
        //组装子弹 播放动画
        const bulletNode = XMgr.bulletMgr.createBulletNode(this.cfg.bullet);
        if (!bulletNode)
            return
        bulletNode.angle = this.node.angle
        bulletNode.x = this.node.x
        bulletNode.y = this.node.y

        let dir = target
            ? new Vec2(target.owner.x - bulletNode.x, target.owner.y - bulletNode.y)
            : new Vec2(
                Math.cos((bulletNode.angle - 90) * Math.PI / 180),
                Math.sin((bulletNode.angle - 90) * Math.PI / 180)
            );
        dir.normalize();

        let bullet = bulletNode.getComponent(XBulletScript);
        if (bullet) bullet.destroy();
        bullet = bulletNode.addComponent(XBulletScript);

        let damage = this.getAtkDamage()
        bullet.shoot(this.cfg.bullet, damage, dir, target, this.data)

        tween(this.skinNode)
            .to(0.05, { scale: v3(1.1, 1.1, 1) })
            .to(0.1, { scale: v3(0.8, 0.8, 1.0) })
            .to(0.05, { scale: v3(1.0, 1.0, 1.0) })
            .call(() => {

            })
            .start()

        this.fireEvent()
    }

    fireEvent() {
        let bed = XMgr.buildingMgr.getRoom(this.data.roomId).bedModelList[0];
        if (bed && !bed.isDie) {
            bed.owner.emit(XEventNames.Tower_Be_fire, this.data.lv);
        }
    }
}


