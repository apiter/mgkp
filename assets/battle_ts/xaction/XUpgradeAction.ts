import XBTAction from "../bt2/XBTAction";
import { XBTCategory, XBTStatus } from "../bt2/XBTEnum";
import { XPlayerScript } from "../view/player/XPlayerScript";
import { XPropertiesKey } from "../xcdt/XPropertiesKey";
import XMgr from "../XMgr";

export class XUpgradeAction extends XBTAction {
    static NAME = "XUpgradeAction"
    constructor() {
        super({
            name: XUpgradeAction.NAME, title: "", properties: null
        })
    }

    tick(tick_) {
        let target = tick_.target as XPlayerScript;
        let status = XBTStatus.FAILURE;
        let model = target.getDataModel();

        if (!model.isDie && model.isBed) {
            let buildData = this.takeOut(XPropertiesKey.BUILD);

            if (buildData) {
                if (target.hasEnoughCoinEnergy(buildData)) {
                    XMgr.buildingMgr.build(model.uuid, buildData.id, buildData.x, buildData.y, 0, 1);
                } else {
                    XMgr.buildingMgr.buildFree(model.uuid, buildData.id, buildData.x, buildData.y, 0, 1);
                }
                status = XBTStatus.SUCCESS;
            } else {
                let upgradeData = this.takeOut(XPropertiesKey.UPGRADE);
                if (upgradeData) {
                    target.upgradeBuilding(upgradeData);
                    status = XBTStatus.SUCCESS;
                }
            }
        }
        return status;
    }
}
XUpgradeAction.register(XUpgradeAction.NAME, XBTCategory.ACTION);


