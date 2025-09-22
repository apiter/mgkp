import { _decorator, Component, Node } from 'cc';
import { XBTCondition } from '../bt2/XBTCondition';
import { XBTCategory } from '../bt2/XBTEnum';
import XBTTick from '../bt2/XBTTick';
import { XPropertiesKey } from './XPropertiesKey';
const { ccclass, property } = _decorator;

@ccclass('XHasSkillId01')
export class XHasSkillId01 extends XBTCondition {
    static NAME = "XHasSkillId01"

    constructor(child_ = null) {
        super({
            name:XHasSkillId01.NAME,
            child:child_
        })
    }

    satisfy(tick_:XBTTick) {
        return !!tick_.blackboard.get(XPropertiesKey.SKILLID, tick_.tree.id)
    }
}

XHasSkillId01.register(XHasSkillId01.NAME, XBTCategory.CONDITION)


