import { ActionNode } from "../bt/ActionNode";
import { NodeStatus } from "../bt/NodeStatus";

export class XRunAction extends ActionNode {
    canThrough = false
    aniName = ""
    constructor(aniName_, canThrough_) {
        super("XRunAction")
        this.aniName = aniName_
        this.canThrough = canThrough_
    }
    open(e) {
        e.target.playAnim(this.aniName)
    }
    tick(e) {
        let t = e.target;
        let i = t.getCurPath();
    
        if (i && i.length !== 0) {
            return t.runWithPath(i, this.canThrough) ? NodeStatus.FAILURE : NodeStatus.SUCCESS;
        }
    
        return NodeStatus.FAILURE;
    }
    
}


