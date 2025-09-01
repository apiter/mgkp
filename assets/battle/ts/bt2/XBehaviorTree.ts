import { _decorator, Component, error, Node } from 'cc';
import XUtil from '../xutil/XUtil';
import XBTBaseNode from './XBTBaseNode';
import XBTDecorator from './XBTDecorator';
import { XBTNodeMgr } from './XBTNodeMgr';
import { XBTCategory } from './XBTEnum';
import XBTTick from './XBTTick';
import { XBTBlackboard } from './XBTBlackboard';
const { ccclass, property } = _decorator;

@ccclass('XBehaviorTree')
export class XBehaviorTree {
    id = ""
    title = ""
    description = ""
    properties = {}
    root: XBTBaseNode = null

    constructor() {
        this.id = XUtil.createUUIDEx(5)
        this.title = "The behavior tree"
        this.description = "Default description"
        this.properties = {}
        this.root = null
    }

    load(e, a) {
        // a = a || {}
        // this.title = e.title || this.title
        // this.description = e.description || this.description
        // this.properties = e.properties || this.properties;
        // let n, u, f, g = {};
        // for (n in e.nodes) {
        //     let t;
        //     if (u = e.nodes[n], u.name in a) t = a[u.name];
        //     else if (u.name in XBTNodeMgr.XBTDecorators) t = XBTNodeMgr.XBTDecorators[u.name];
        //     else if (u.name in XBTNodeMgr.XBTComposites) t = XBTNodeMgr.XBTComposites[u.name];
        //     else {
        //         if (!(u.name in XBTNodeMgr.XBTActions)) throw new EvalError('BehaviorTree.load: Invalid node name + "' + u.name + '".');
        //         t = XBTNodeMgr.XBTActions[u.name]
        //     }
        //     f = new t(u.properties), f.id = u.id || f.id, f.title = u.title || f.title, f.description = u.description || f.description, f.properties = u.properties || f.properties, g[n] = f
        // }
        // for (n in e.nodes)
        //     if (u = e.nodes[n], f = g[n], f.category === XBTCategory.COMPOSITE && u.children)
        //         for (let t = 0; t < u.children.length; t++) {
        //             let e = u.children[t];
        //             f.children.push(g[e])
        //         } else f.category === XBTCategory.DECORATOR && u.child && (f.child = g[u.child]);
        // this.root = g[e.root]
    }

    tick(target_, blackBoard_: XBTBlackboard) {
        if (!blackBoard_) return error("The blackboard parameter is obligatory and must be an instance of b3.Blackboard");
        if (!this.root) return;
        let tickData = new XBTTick;
        tickData.target = target_
        tickData.blackboard = blackBoard_
        tickData.tree = this;
        let tick_frame = blackBoard_.get("tick_frame", this.id);
        null == tick_frame ? blackBoard_.set("tick_frame", 0, this.id) : blackBoard_.set("tick_frame", tick_frame + 1, this.id);
        let status = this.root._execute(tickData)
        let boardOpenNodes = blackBoard_.get("openNodes", this.id) as XBTBaseNode[]
        let tickOpenNodes = tickData._openNodes.slice(0)
        let p = 0;
        for (let u = 0; u < Math.min(boardOpenNodes.length, tickOpenNodes.length) && (p = u + 1, boardOpenNodes[u] === tickOpenNodes[u]); u++);
        for (let u = boardOpenNodes.length - 1; u >= p; u--)
            boardOpenNodes[u]._close(tickData);
        blackBoard_.set("openNodes", tickOpenNodes, this.id)
        blackBoard_.set("nodeCount", tickData._nodeCount, this.id)
        return status
    }
}

