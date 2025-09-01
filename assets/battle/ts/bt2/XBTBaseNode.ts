import { error } from "cc";
import XUtil from "../xutil/XUtil";
import { XBTCategory, XBTStatus } from "./XBTEnum";
import { XBTNodeMgr } from "./XBTNodeMgr";
import XBTTick from "./XBTTick";
export default
    class XBTBaseNode {
    id = ""
    category = ""
    name = ""
    title = ""
    description = ""
    properties = {}

    out: XBTBaseNode[] = []

    constructor({
        category: catgory_ = "",
        name: name_ = "",
        title: title_ = "",
        description: des_ = "",
        properties: props_
    }) {
        this.id = XUtil.createUUIDEx(10),
            this.category = catgory_,
            this.name = name_,
            this.title = title_ || name_,
            this.description = des_,
            this.properties = props_ || {}
    }
    static register(e, a) {
        let n = this;
        switch (a) {
            case XBTCategory.COMPOSITE:
                XBTNodeMgr.XBTComposites[e] = n;
                break;
            case XBTCategory.DECORATOR:
                XBTNodeMgr.XBTDecorators[e] = n;
                break;
            case XBTCategory.ACTION:
                XBTNodeMgr.XBTActions[e] = n;
                break;
            case XBTCategory.CONDITION:
                XBTNodeMgr.XBTConditions[e] = n;
                break;
            default:
                error("not found node category !")
        }
    }

    _execute(data_: XBTTick) {
        this._enter(data_)
        data_.blackboard.get("isOpen", data_.tree.id, this.id) || this._open(data_);
        let status = this._tick(data_);
        status !== XBTStatus.RUNNING && this._close(data_)
        this._exit(data_)
        return status
    }

    _enter(data_: XBTTick) {
        data_._enterNode(this)
        this.enter(data_)
    }

    _open(data_: XBTTick) {
        data_._openNode(this)
        data_.blackboard.set("isOpen", true, data_.tree.id, this.id)
        this.open(data_)
    }
    _tick(data_: XBTTick) {
        data_._tickNode(this)
        return this.tick(data_)
    }

    _close(tick_: XBTTick) {
        tick_._closeNode(this)
        tick_.blackboard.set("isOpen", false, tick_.tree.id, this.id)
        this.close(tick_)
    }

    _exit(tick_: XBTTick) {
        tick_._exitNode(this)
        this.exit(tick_)
    }

    enter(t) {

    }

    open(t) {

    }

    tick(t) {
        error("BTBaseNode tick not implement !")
        return XBTStatus.FAILURE
    }

    close(t) {

    }
    exit(t) {

    }

    bindout(...out_) {
        this.out = out_
        return this
    }
    output(key_, value_) {
        if (this.out)
            for (const node of this.out)
                node.properties[key_] = value_
    }
    takeOut(key_) {
        let value = this.properties[key_]
        this.properties[key_] = undefined
        return value
    }
}

