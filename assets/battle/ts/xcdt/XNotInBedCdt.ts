import { XBTCondition } from '../bt2/XBTCondition';
import { XBTCategory } from '../bt2/XBTEnum';
import XBTTick from '../bt2/XBTTick';
export class XNotInBedCdt extends XBTCondition {
    constructor(child_ = null) {
        super({
            name: "XNotInBedCdt",
            title: "",
            properties: null,
            child: child_
        })
    }
    satisfy(tick_: XBTTick) {
        let isNotInBed = !tick_.target.isInBed()
        return isNotInBed
    }
}
XNotInBedCdt.register("XNotInBedCdt", XBTCategory.CONDITION);


