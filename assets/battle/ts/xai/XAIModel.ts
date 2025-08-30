import { BehaviorTree } from "../bt/BehaviorTree"
import { Blackboard } from "../bt/Blackboard"
import { XIdleAction } from "../xaction/XIdlection"
import { XRunAction } from "../xaction/XRunAction"

export class XAIModel {
    // blackboard: Blackboard
    bt: BehaviorTree = null
    data = null
    constructor(data_) {
        // this.blackboard = blackBoard_ || new Blackboard
        this.bt = new BehaviorTree
        this.data = data_
    }
    load(root) {
        this.bt.rootNode = root
    }
    exec() {
        this.bt.tick(this.data)
    }

    clearAI() {
    }

    idle(e) {
        return new XIdleAction(e)
    }

    run(e, t) {
        let i = new XRunAction(e, t);
        return new fx.BTSequence({
            children: [new XHasTargetCdt, (new XHasPathCdt).bindout(i), new XNotInStopRangeCdt(this.data.getAttackRange()), i],
            continuePolicy: Ie.SUCCESS,
            successPolicy: fx.EPolicy.RequireAll
        })
    }
}


