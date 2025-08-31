import { _decorator, Component, Node } from 'cc';
import XUtil from '../xutil/XUtil';
import XBTBaseNode from './XBTBaseNode';
import XBTDecorator from './XBTDecorator';
import { XBTNodeMgr } from './XBTNodeMgr';
import { XBTCategory } from './XBTEnum';
import XBTTick from './XBTTick';
const { ccclass, property } = _decorator;

@ccclass('XBehaviorTree')
export class XBehaviorTree {
    id = ""
    title = ""
    description = ""
    properties = {}
    root: XBTBaseNode = null
    debug = null

    constructor() {
        this.id = XUtil.createUUIDEx(5)
        this.title = "The behavior tree"
        this.description = "Default description"
        this.properties = {}
        this.root = null
        this.debug = null
    }
    load(e, a) {
        a = a || {}
        this.title = e.title || this.title
        this.description = e.description || this.description
        this.properties = e.properties || this.properties;
        let n, u, f, g = {};
        for (n in e.nodes) {
            let t;
            if (u = e.nodes[n], u.name in a) t = a[u.name];
            else if (u.name in XBTNodeMgr.XBTDecorators) t = XBTNodeMgr.XBTDecorators[u.name];
            else if (u.name in XBTNodeMgr.XBTComposites) t = XBTNodeMgr.XBTComposites[u.name];
            else {
                if (!(u.name in XBTNodeMgr.XBTActions)) throw new EvalError('BehaviorTree.load: Invalid node name + "' + u.name + '".');
                t = XBTNodeMgr.XBTActions[u.name]
            }
            f = new t(u.properties), f.id = u.id || f.id, f.title = u.title || f.title, f.description = u.description || f.description, f.properties = u.properties || f.properties, g[n] = f
        }
        for (n in e.nodes)
            if (u = e.nodes[n], f = g[n], f.category === XBTCategory.COMPOSITE && u.children)
                for (let t = 0; t < u.children.length; t++) {
                    let e = u.children[t];
                    f.children.push(g[e])
                } else f.category === XBTCategory.DECORATOR && u.child && (f.child = g[u.child]);
        this.root = g[e.root]
    }

    tick(t, e) {
        if (!e) throw "The blackboard parameter is obligatory and must be an instance of b3.Blackboard";
        if (!this.root) return;
        let a = new XBTTick;
        a.debug = this.debug, a.target = t, a.blackboard = e, a.tree = this;
        let n = e.get("tick_frame", a.tree.id);
        null == n ? e.set("tick_frame", 0, a.tree.id) : e.set("tick_frame", n + 1, a.tree.id);
        let u, f = this.root._execute(a),
            g = e.get("openNodes", this.id),
            _ = a._openNodes.slice(0),
            p = 0;
        for (u = 0; u < Math.min(g.length, _.length) && (p = u + 1, g[u] === _[u]); u++);
        for (u = g.length - 1; u >= p; u--) g[u]._close(a);
        return e.set("openNodes", _, this.id), e.set("nodeCount", a._nodeCount, this.id), f
    }
}

