import { _decorator, Component, game, Node, tween, v3, Vec2 } from 'cc';
import { XBuildingScript } from './XBuildingScript';
import XTowerModel from '../../model/XTowerModel';
import { XConst } from '../../xconfig/XConst';
import { XV2Util01 } from '../../xutil/XV2Util01';
import XMgr from '../../XMgr';
import XBuildingModel from '../../model/XBuildingModel';
import XPlayerModel from '../../model/XPlayerModel';
import { XBulletScript } from './XBulletScript';
import { XGameStatus } from '../../xconfig/XEnum';
import { XTowerBaseScript } from './XTowerBaseScript';
const { ccclass, property } = _decorator;

@ccclass('XTowerScript')
export class XTowerScript extends XTowerBaseScript {

    tryAttack() {
        if (this._towerData.isDizzy) {
            this.isWork = false;
            return;
        }

        this.isWork = false;
        let targets = this.findTargets();
        if (targets.length) {
            this.atkTarget = targets[0];
            XV2Util01.faceToCC(this.node, this.atkTarget.owner.worldPositionX, this.atkTarget.owner.worldPositionY, -90);
            // this.addCoinByAtk();

            for (const target of targets) {
                this.fire(target);
            }
            this.isWork = true;
        }
    }
}


