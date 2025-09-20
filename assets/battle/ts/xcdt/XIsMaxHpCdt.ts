import { _decorator, Component, Node } from 'cc';
import { XBTCondition } from '../bt2/XBTCondition';
import { XBTCategory } from '../bt2/XBTEnum';
import XBTTick from '../bt2/XBTTick';
import { XPlayerScript } from '../view/player/XPlayerScript';
const { ccclass, property } = _decorator;

@ccclass('XIsMaxHpCdt')
export class XIsMaxHpCdt extends XBTCondition {
    static NAME = "XIsMaxHpCdt"
  
    constructor(child_ = null) {
        super({
            name: XIsMaxHpCdt.NAME,
            child: child_
        })
    }
    satisfy(tick_:XBTTick) {
        let target = tick_.target as XPlayerScript;
        return !target.getDataModel().isBack && target.isMaxHp()
    }
}

XIsMaxHpCdt.register(XIsMaxHpCdt.NAME, XBTCategory.CONDITION)

