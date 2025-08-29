import { BTNode } from "./BTNode";
import { NodeStatus } from "./NodeStatus";

/** 反转节点：把子节点 SUCCESS <-> FAILURE */
export class InverterNode extends BTNode {
    constructor(name: string, private child: BTNode) {
        super(name);
    }

    tick(): NodeStatus {
        const status = this.child.tick();
        if (status === NodeStatus.SUCCESS) 
            this.status = NodeStatus.FAILURE;
        else if (status === NodeStatus.FAILURE) this.status = NodeStatus.SUCCESS;
        else this.status = NodeStatus.RUNNING;
        return this.status;
    }

    reset() {
        super.reset();
        this.child.reset();
    }
}