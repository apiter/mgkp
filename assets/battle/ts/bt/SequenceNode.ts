import { BTNode } from "./BTNode";
import { NodeStatus } from "./NodeStatus";

/** 顺序节点：子节点依次执行，失败则停止 */
export class SequenceNode extends BTNode {
    private currentIndex = 0;

    constructor(name: string, public children: BTNode[]) {
        super(name);
    }

    tick(data): NodeStatus {
        while (this.currentIndex < this.children.length) {
            const child = this.children[this.currentIndex];
            const status = child.tick(data);

            if (status === NodeStatus.RUNNING) {
                this.status = NodeStatus.RUNNING;
                return this.status;
            }

            if (status === NodeStatus.FAILURE) {
                this.status = NodeStatus.FAILURE;
                this.currentIndex = 0;
                return this.status;
            }

            this.currentIndex++;
        }

        this.status = NodeStatus.SUCCESS;
        this.currentIndex = 0;
        return this.status;
    }

    reset() {
        super.reset();
        this.children.forEach(c => c.reset());
        this.currentIndex = 0;
    }
}
