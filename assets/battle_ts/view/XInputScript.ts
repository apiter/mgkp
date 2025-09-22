import { _decorator, Component, EventTouch, Node, Touch, UITransform, v2, v3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('XInputScript')
export class XInputScript extends Component {
    visible = true
    canHandle = true

    joystickNode: Node = null
    handle: Node = null
    input: Vec2
    lastPos: Vec2
    downPos: Vec2
    mouseDown = false

    clickHandler: (touch: EventTouch) => void = null
    downHandler: (touch: EventTouch) => void = null
    moveHandler: (deltaX, deltaY) => void = null

    onLoad() {
        this.joystickNode = this.node.getChildByName("joystickNode")
        this.joystickNode.active = false
        this.handle = this.joystickNode.getChildByName("handle")
        this.input = v2(0)
        this.lastPos = v2(0)
        this.downPos = v2(0)
        this.node.on(Node.EventType.TOUCH_START, this.onDown, this)
        this.node.on(Node.EventType.TOUCH_MOVE, this.onMove, this)
        this.node.on(Node.EventType.TOUCH_END, this.onUp, this)
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onUp, this)
    }

    onClick(e) {
    }

    onDown(touch: EventTouch) {
        this.mouseDown = true
        let touchPtLocal = this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(touch.getLocationX(), touch.getLocationY()))
        this.joystickNode.setPosition(touchPtLocal.x, touchPtLocal.y)
        this.visible && (this.joystickNode.active = true)
        this.drag(touchPtLocal.x, touchPtLocal.y)
        this.lastPos.set(touchPtLocal.x, touchPtLocal.y)
        this.downPos.set(touchPtLocal.x, touchPtLocal.y)
        this.downHandler && this.downHandler?.(touch)
    }
    onMove(touch: EventTouch) {
        if (!this.mouseDown)
            return;
        let touchPtLocal = this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(touch.getLocationX(), touch.getLocationY()))
        this.drag(touchPtLocal.x, touchPtLocal.y)
        this.moveHandler && this.moveHandler?.(touch.getDeltaX(), touch.getDeltaY())
    }

    onUp(touch: EventTouch) {
        if (this.mouseDown) {
            this.mouseDown = false
            this.input.set(0, 0)
            this.updateHandle()
            this.joystickNode.active = false


            const touchDis = Vec2.distance(touch.getStartLocation(), touch.getLocation())
            if (touchDis <= 2) {
                this.clickHandler?.(touch)
            }
        }
    }

    drag(x_, y_) {
        this.input.x = x_ - this.joystickNode.x
        this.input.y = y_ - this.joystickNode.y;
        // let i = (this.joystickNode.width - this.handle.width) / 2;
        // fx.V2.scale(this.input, 1 / i, this.input)
        // fx.V2.scalarLength(this.input) > 1 && fx.V2.normalize(this.input, this.input)
        this.updateHandle()
    }
    updateHandle() {
        //触点位置
        // let e = (this.joystickNode.width - this.handle.width) / 2;
        // this.handle.centerX = this.input.x * e
        // this.handle.centerY = this.input.y * e
    }
    show() {
        this.visible = true
        this.joystickNode.active = true
    }
    hide() {
        this.visible = false
        this.joystickNode.active = false
    }
    stop() {
        this.mouseDown = false
        this.input.set(0, 0)
        this.updateHandle()
        this.joystickNode.active = false
    }
    getlastpos() {
        return new Vec2(this.lastPos.x - this.downPos.x, this.lastPos.y - this.downPos.y)
    }
}