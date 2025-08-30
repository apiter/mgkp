import { BTNode } from "./BTNode";
import { NodeStatus } from "./NodeStatus";

/**
 * 行为树类，负责管理根节点及树的执行
 */
export class BehaviorTree {
    rootNode: BTNode;

    constructor(rootNode?: BTNode) {
        this.rootNode = rootNode;
    }

    // 每帧调用更新行为树
    tick(data): NodeStatus {
        return this.rootNode.tick(data);
    }

    // 重置行为树状态
    reset() {
        this.rootNode.reset();
    }
}
