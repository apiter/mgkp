// BTNode.ts
import { NodeStatus } from './NodeStatus';

/**
 * 行为树基类
 */
export abstract class BTNode {
    public status: NodeStatus = NodeStatus.RUNNING;

    constructor(public name: string = "BTNode") {
        
    }

    // 每帧执行
    abstract tick(data): NodeStatus;

    // 重置节点状态
    reset() {
        this.status = NodeStatus.RUNNING;
    }
}