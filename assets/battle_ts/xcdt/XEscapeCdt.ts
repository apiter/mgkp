import { XBTCondition } from '../bt2/XBTCondition';
import XBTTick from '../bt2/XBTTick';
import { XPlayerScript } from '../view/player/XPlayerScript';
import XMgr from '../XMgr';
import LogWrapper, { XLogModule } from '../log/LogWrapper';
import { XToast } from '../view/XToast';

export class XEscapeCdt extends XBTCondition {
    static NAME = "XEscapeCdt"
    constructor(child_ = null) {
        super({
            child: child_,
            properties: null,
            title: XEscapeCdt.NAME,
            name: XEscapeCdt.NAME
        })
    }
    
    satisfy(data_: XBTTick): boolean {
        const playerScript = data_.target as XPlayerScript
        // 如果目标处于逃跑状态
        if (playerScript.isEscapeHp() || playerScript.isEscape()) {
            let playerModel = playerScript.getDataModel();
    
            // 更新目标状态
            playerScript.setCurTarget(null);
            playerScript.setLastAtkTarget(null);
            playerScript.setEscape(true);
    
            XToast.show(`${playerModel.name}逃跑了`)
            // LogWrapper.log(`流程`, `${playerModel.name}逃跑了`, {}, [XLogModule.XLogModuleGameFlow])
            return true;
        }
        return false
    }
}


