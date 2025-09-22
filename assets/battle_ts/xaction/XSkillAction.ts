import XBTAction from '../bt2/XBTAction';
import { XBTCategory, XBTStatus } from '../bt2/XBTEnum';
import XBTTick from '../bt2/XBTTick';
import { XPropertiesKey } from '../xcdt/XPropertiesKey';

export class XSkillAction extends XBTAction {
    static NAME = "XSkillAction"

    constructor() {
        super({
            name:XSkillAction.NAME
        })
    }

    tick(tick_:XBTTick) {
        let target = tick_.target 
        let skillId = tick_.blackboard.get(XPropertiesKey.SKILLID, tick_.tree.id)
        tick_.blackboard.set(XPropertiesKey.SKILLID, null, tick_.tree.id)
        target.performSkill?.(skillId)
        return XBTStatus.SUCCESS
    }
}

XSkillAction.register(XSkillAction.NAME, XBTCategory.ACTION)


