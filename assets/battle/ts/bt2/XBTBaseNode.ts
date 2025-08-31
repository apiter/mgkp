import XUtil from "../xutil/XUtil";
import { XBTCategory, XBTStatus } from "./XBTEnum";
import { XBTNodeMgr } from "./XBTNodeMgr";
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
        category: t = "",
        name: e = "",
        title: a = "",
        description: n = "",
        properties: u
    }) {
        this.id = XUtil.createUUID(),
            this.category = t,
            this.name = e,
            this.title = a || e,
            this.description = n,
            this.properties = u || {}
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
                throw Error("not found node category !")
        }
    }

    _execute(data_) {
        this._enter(data_)
        data_.blackboard.get("isOpen", data_.tree.id, this.id) || this._open(data_);
        let status = this._tick(data_);
        status !== XBTStatus.RUNNING && this._close(data_)
        this._exit(data_)
        return status
    }

    _enter(t) {
        t._enterNode(this)
        this.enter(t)
    }

    _open(t) {
        t._openNode(this)
        t.blackboard.set("isOpen", !0, t.tree.id, this.id)
        this.open(t)
    }
    _tick(t) {
        t._tickNode(this)
        return this.tick(t)
    }

    _close(t) {
        t._closeNode(this)
        t.blackboard.set("isOpen", false, t.tree.id, this.id)
        this.close(t)
    }

    _exit(t) {
        t._exitNode(this)
        this.exit(t)
    }

    enter(t) {

    }

    open(t) {

    }

    tick(t) {
        throw Error("BTBaseNode tick not implement !")
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

