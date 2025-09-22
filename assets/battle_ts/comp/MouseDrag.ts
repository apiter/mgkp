import { _decorator, Component, Node, EventMouse, Input, input, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MouseDrag')
export class MouseDrag extends Component {
    private _isDragging: boolean = false;
    private _offset: Vec3 = new Vec3();

    start() {
        // 监听全局鼠标事件
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onDestroy() {
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    private onMouseDown(event: EventMouse) {
        const location = event.getUILocation();
        const clickPos = new Vec3(location.x, location.y, 0);

        // 获取节点的 UITransform 来判断点击是否在节点范围内
        const uiTrans = this.node.getComponent(UITransform);
        if (uiTrans && uiTrans.hitTest(location)) {
            this._isDragging = true;
            // 计算点击点和节点中心的偏移量
            const nodePos = this.node.worldPosition.clone();
            this._offset.set(nodePos.x - clickPos.x, nodePos.y - clickPos.y, 0);
        }
    }

    private onMouseMove(event: EventMouse) {
        if (!this._isDragging) return;

        const location = event.getUILocation();
        const newPos = new Vec3(location.x + this._offset.x, location.y + this._offset.y, 0);

        this.node.setWorldPosition(newPos);
    }

    private onMouseUp(event: EventMouse) {
        this._isDragging = false;
    }
}
