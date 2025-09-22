import XBTAction from "../bt2/XBTAction";
import { XBTCategory, XBTStatus } from "../bt2/XBTEnum";

export class XTakeMapBuildAction extends XBTAction {
    static NAME = "XTakeMapBuildAction"
    constructor() {
        super({
            name: XTakeMapBuildAction.NAME,
            title: "",
            properties: null
        })
    }

    tick(data_) {
        let target = data_.target;
        if (target.getTakeMapBuild()) {
            target.setMapBuildTarget(null)
            return XBTStatus.FAILURE;
        }
        let mapBuildTarget = target.getMapBuildTarget();
        return mapBuildTarget && target.takeMapBuild(mapBuildTarget) ? XBTStatus.SUCCESS : XBTStatus.FAILURE
    }
}
XTakeMapBuildAction.register(XTakeMapBuildAction.NAME, XBTCategory.ACTION);


