import { XBTCondition } from '../bt2/XBTCondition';
import { XBTCategory } from '../bt2/XBTEnum';
export class XNotInBedCdt extends XBTCondition {
    constructor(child_ = null) {
        super({
            name: "XNotInBedCdt",
            title:"",
            properties:null,
            child: child_
        })
    }
    satisfy(e) {
        return !e.target.isInBed()
    }
}
XNotInBedCdt.register("XNotInBedCdt", XBTCategory.CONDITION);


