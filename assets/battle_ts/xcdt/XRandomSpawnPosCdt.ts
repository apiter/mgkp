import { _decorator, Component, Node } from 'cc';
import { XBTCondition } from '../bt2/XBTCondition';
import { XBTCategory } from '../bt2/XBTEnum';
import { XPropertiesKey } from './XPropertiesKey';
import XBTTick from '../bt2/XBTTick';
const { ccclass, property } = _decorator;

@ccclass('XRandomSpawnPosCdt')
export class XRandomSpawnPosCdt extends XBTCondition {
    static NAME = "XRandomSpawnPosCdt"

    constructor(child_ = null) {
        super({
            name: XRandomSpawnPosCdt.NAME,
            child: child_
        })
    }
    satisfy(tick_:XBTTick) {
        let healZonePos = tick_.target.getRandomHealZonePos();
        return !!healZonePos && (this.output(XPropertiesKey.DESTPOS, healZonePos), true)
    }
}

XRandomSpawnPosCdt.register(XRandomSpawnPosCdt.NAME, XBTCategory.CONDITION)


