import { BTNode } from "./BTNode";
import { NodeStatus } from "./NodeStatus";
import { Blackboard } from "./Blackboard";

export class ActionNode extends BTNode {
    //private action: (blackboard: Blackboard) => NodeStatus,
    //private blackboard: Blackboard

    constructor(
        name: string
    ) {
        super(name);
    }

    tick(data_): NodeStatus {
        return NodeStatus.RUNNING;
    }
}


