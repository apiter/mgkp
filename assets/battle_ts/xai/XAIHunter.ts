import XBTBaseNode from '../bt2/XBTBaseNode';
import { XBTStatus, XEPolicy } from '../bt2/XBTEnum';
import { XBTInverter } from '../bt2/XBTInverter';
import { XBTSequence } from '../bt2/XBTSequence';
import XBTUtil from '../bt2/XBTUtil';
import { XBTWaitUtil } from '../bt2/XBTWaitUtil';
import { XEventNames } from '../event/XEventNames';
import { XPlayerScript } from '../view/player/XPlayerScript';
import { XAttackAction } from '../xaction/XAttackAction';
import { XClearTargetAction } from '../xaction/XClearTargetAction';
import { XPostEventAction } from '../xaction/XPostEventAction';
import XRunAction from '../xaction/XRunAction';
import { XSimpleRunAction } from '../xaction/XSimpleRunAction';
import { XSkillAction } from '../xaction/XSkillAction';
import { XEscapeCdt } from '../xcdt/XEscapeCdt';
import { XHasBuildingAroundCdt } from '../xcdt/XHasBuildingAroundCdt';
import XHasPathCdt from '../xcdt/XHasPathCdt';
import { XHasPlayerAroundCdt } from '../xcdt/XHasPlayerAroundCdt';
import { XHasPlayerAtkCdt } from '../xcdt/XHasPlayerAtkCdt';
import { XHasSkillId01 } from '../xcdt/XHasSkillId01';
import XHasTargetCdt from '../xcdt/XHasTargetCdt';
import { XHunterFindRoomCdt } from '../xcdt/XHunterFindRoomCdt';
import { XIsMaxHpCdt } from '../xcdt/XIsMaxHpCdt';
import XNotInStopRangeCdt from '../xcdt/XNotInStopRangeCdt';
import { XOneTrueCdt } from '../xcdt/XOneTrueCdt';
import { XRandomSpawnPosCdt } from '../xcdt/XRandomSpawnPosCdt';
import { XAIModel } from './XAIModel';

export class XAIHunter extends XAIModel {
    constructor(playerScript: XPlayerScript, blackBoard = null) {
        super(playerScript, blackBoard)
    }

    canPatrol(child_: XBTBaseNode) {
        const ret = new XOneTrueCdt(new XHasPlayerAroundCdt(), new XHasBuildingAroundCdt(), new XHasPlayerAtkCdt(), new XHunterFindRoomCdt())
        ret.add(child_)
        return ret
    }

    patrol() {
        let runAction = new XRunAction("move", null);
        return new XBTSequence({
            children: [new XHasTargetCdt(), new XHasPathCdt(), new XNotInStopRangeCdt(this.data.getAttackRange()), runAction],
            title: "patrol",
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

    canEscape(child_) {
        let t = new XOneTrueCdt(new XEscapeCdt);
        t.add(child_)
        return t
    }

    escape(aniName_) {
        let runAction = new XRunAction(aniName_, null)
        let simpleRunAction = new XSimpleRunAction
        let seq = new XBTSequence({
            children:[simpleRunAction, runAction],
            continuePolicy:XBTStatus.SUCCESS,
            successPolicy:XEPolicy.RequireAll
        })

        let hasPathCdt = (new XHasPathCdt).bindout(runAction)
        return new XBTSequence({
            children:[(new XRandomSpawnPosCdt).bindout(hasPathCdt), hasPathCdt, new XPostEventAction(XEventNames.E_HUNTER_ESCAPE),
                new XBTWaitUtil({
                    condition:new XIsMaxHpCdt,
                    child:seq
                }),
                new XClearTargetAction
            ],
            successPolicy:XEPolicy.RequireAll,
            continuePolicy:XBTStatus.SUCCESS
        })
    }

    skill() {
        const hasSkill01 = new XHasSkillId01()
        const skillAction = new XSkillAction()
        return new XBTSequence(
            {
                children:[hasSkill01, skillAction],
                successPolicy:XEPolicy.RequireAll,
                continuePolicy:XBTStatus.SUCCESS
            }
        )
    }
}


