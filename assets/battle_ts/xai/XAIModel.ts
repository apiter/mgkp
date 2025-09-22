import { XBehaviorTree } from "../bt2/XBehaviorTree"
import { XBTBlackboard } from "../bt2/XBTBlackboard"
import { XBTStatus, XEPolicy } from "../bt2/XBTEnum"
import { XBTSequence } from "../bt2/XBTSequence"
import XIdleAction from "../xaction/XIdlection"
import XRunAction from "../xaction/XRunAction"
import XHasPathCdt from "../xcdt/XHasPathCdt"
import XHasTargetCdt from "../xcdt/XHasTargetCdt"
import XNotInStopRangeCdt from "../xcdt/XNotInStopRangeCdt"

export class XAIModel {
    blackboard: XBTBlackboard
    bt: XBehaviorTree = null
    data = null
    constructor(data_, blackBoard_) {
        this.blackboard = blackBoard_ || new XBTBlackboard
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

    idle(aniName_) {
        return new XIdleAction(aniName_)
    }

    run(aniName_, canThrough_) {
        let run = new XRunAction(aniName_, canThrough_);
        return new XBTSequence({
            children: [new XHasTargetCdt(null), (new XHasPathCdt(null, null).bindout(run)), new XNotInStopRangeCdt(this.data.getAttackRange(), null), run],
            title:"run",
            continuePolicy: XBTStatus.SUCCESS,
            successPolicy: XEPolicy.RequireAll
        })
    }
}


