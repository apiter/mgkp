import { BTNode } from "./BTNode";
import { NodeStatus } from "./NodeStatus";

/** 选择节点：子节点依次执行，成功则停止 */
export class SelectorNode extends BTNode {
    private currentIndex = 0;

    constructor(name: string, public children: BTNode[]) {
        super(name);
    }

    tick(): NodeStatus {
        while (this.currentIndex < this.children.length) {
            const child = this.children[this.currentIndex];
            const status = child.tick();

            if (status === NodeStatus.RUNNING) {
                this.status = NodeStatus.RUNNING;
                return this.status;
            }

            if (status === NodeStatus.SUCCESS) {
                this.status = NodeStatus.SUCCESS;
                this.currentIndex = 0;
                return this.status;
            }

            this.currentIndex++;
        }

        this.status = NodeStatus.FAILURE;
        this.currentIndex = 0;
        return this.status;
    }

    reset() {
        super.reset();
        this.children.forEach(c => c.reset());
        this.currentIndex = 0;
    }
}