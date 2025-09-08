import XBTBaseNode from '../bt2/XBTBaseNode';
import { XBTStatus, XEPolicy } from '../bt2/XBTEnum';
import { XBTInverter } from '../bt2/XBTInverter';
import { XBTSequence } from '../bt2/XBTSequence';
import { XPlayerScript } from '../view/player/XPlayerScript';
import { XAttackAction } from '../xaction/XAttackAction';
import XRunAction from '../xaction/XRunAction';
import { XHasBuildingAroundCdt } from '../xcdt/XHasBuildingAroundCdt';
import XHasPathCdt from '../xcdt/XHasPathCdt';
import XHasTargetCdt from '../xcdt/XHasTargetCdt';
import { XHunterFindRoomCdt } from '../xcdt/XHunterFindRoomCdt';
import XNotInStopRangeCdt from '../xcdt/XNotInStopRangeCdt';
import { XOneTrueCdt } from '../xcdt/XOneTrueCdt';
import { XAIModel } from './XAIModel';

export class XAIHunter extends XAIModel {
    constructor(playerScript: XPlayerScript, blackBoard = null) {
        super(playerScript, blackBoard)
    }

    canPatrol(child_: XBTBaseNode) {
        const ret = new XOneTrueCdt(new XHasBuildingAroundCdt(), new XHunterFindRoomCdt())
        ret.add(child_)
        return ret
    }

    patrol() {
        let runAction = new XRunAction("move", null);
        return new XBTSequence({
            children: [new XHasTargetCdt(), new XHasPathCdt(), new XNotInStopRangeCdt(this.data.getAttackRange()), runAction],
            title:"patrol",
            continuePolicy: XBTStatus.SUCCESS,
            successPolicy: XEPolicy.RequireAll
        })
    }

    attack() {
        const inRangeCdt = new XBTInverter(
            {
                child: new XNotInStopRangeCdt(this.data.getAttackRange())
            }
        )
        return new XBTSequence({
            children: [inRangeCdt, new XHasTargetCdt(), new XAttackAction()],
            title: "Attack",
            continuePolicy: XBTStatus.SUCCESS,
            successPolicy: XEPolicy.RequireAll
        })
    }
}


