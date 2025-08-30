import { ActionNode } from '../bt/ActionNode';
import { NodeStatus } from '../bt/NodeStatus';

export class XIdleAction extends ActionNode {
    aniName = ""
    constructor(aniName_) {
        super("XIdleAction")
        this.aniName = aniName_
    }

    open(e) {
        e.target.playAnim(this.aniName)
    }

    tick(e) {
        return NodeStatus.SUCCESS
    }
}


