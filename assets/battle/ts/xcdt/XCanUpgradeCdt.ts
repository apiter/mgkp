import { XBTCondition } from "../bt2/XBTCondition";
import { XBTCategory } from "../bt2/XBTEnum";

export class XCanUpgradeCdt extends XBTCondition {
    static NAME = "XCanUpgradeCdt"
    skillBuildArr = []
    lastCheckTime

    constructor(child_ = null) {
        super({
            name: XCanUpgradeCdt.NAME, title: "", properties: null,
            child: child_
        })
    }
    satisfy(data_) {
        return true
    }
}
XCanUpgradeCdt.register(XCanUpgradeCdt.NAME, XBTCategory.CONDITION);
