import { BehaviorTree } from "../bt/BehaviorTree"
import { Blackboard } from "../bt/Blackboard"
import { XBehaviorTree } from "../bt2/XBehaviorTree"
import { XBTBlackboard } from "../bt2/XBTBlackboard"
import { XBTStatus, XEPolicy } from "../bt2/XBTEnum"
import { XBTSequence } from "../bt2/XBTSequence"
import { XIdleAction } from "../xaction/XIdlection"
import { XRunAction } from "../xaction/XRunAction"

export class XAIModel {
    blackboard: XBTBlackboard
    bt: XBehaviorTree = null
    data = null
    constructor(data_, blackBoard_) {
        this.blackboard = blackBoard_ || new Blackboard
        this.bt = new XBehaviorTree
        this.data = data_
    }
    load(root) {
        this.bt.root = root
    }
    exec() {
        this.bt.tick(this.data, this.blackboard)
    }

    clearAI() {
        this.blackboard = new XBTBlackboard
    }

    idle(e) {
        return new XIdleAction(e)
    }

    run(e, t) {
        let i = new XRunAction(e, t);
        return new XBTSequence({
            children: [new XHasTargetCdt, (new XHasPathCdt).bindout(i), new XNotInStopRangeCdt(this.data.getAttackRange()), i],
            continuePolicy: XBTStatus.SUCCESS,
            successPolicy: XEPolicy.RequireAll
        })
    }
}


