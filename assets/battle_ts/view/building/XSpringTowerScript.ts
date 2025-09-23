import { _decorator, Component, Node } from 'cc';
import { XTowerBaseScript } from './XTowerBaseScript';
const { ccclass, property } = _decorator;

@ccclass('XSpringTowerScript')
export class XSpringTowerScript extends XTowerBaseScript {

    getAtkDamage(): number {
        return 0.3 * this.atkTarget.attackPower
    }

    tryAttack(): void {
        if (this._towerData.isDizzy) {
            this.isWork = false;
            return;
        }

        this.isWork = false;
        let target = this.findTarget();
        if (target) {
            this.atkTarget = target;
            this.fire(target);
            this.isWork = true;
        }
    }
}


