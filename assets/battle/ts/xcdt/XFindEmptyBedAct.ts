import { XBTCondition } from "../bt2/XBTCondition";
import { XBTCategory } from "../bt2/XBTEnum";
import XMgr from "../XMgr";
import { XRandomUtil } from "../xutil/XRandomUtil";

export class XFindEmptyBedAct extends XBTCondition {
    lastBed = null
    static NAME = "XFindEmptyBedAct"
    constructor(child_ = null) {
        super({
            name: XFindEmptyBedAct.NAME,
            title: "",
            properties: null,
            child: child_
        })
    }
    satisfy(e) {
        let i, s = e.target,
            a = this.lastBed;
        if (!this.lastBed || (i = s.isBedUsed(this.lastBed))) {
            let n = e.blackboard.get(XFindEmptyBedAct.NAME);
            if (n && 0 != n.length || (n = s.getAllRoomIdRand(), e.blackboard.set(XFindEmptyBedAct.NAME, n)), a = null, i) {
                let e = s.getRoomModel(this.lastBed.roomId),
                    [t, i] = this.findInMoreBedRoom([e]);
                a = t, i && t && n.splice(n.indexOf(a.roomId), 1)
            }
            if (!a) {
                let e = n.length,
                    i = XRandomUtil.random(),
                    r = [],
                    o = [];
                for (; e--;) {
                    if (0 == XMgr.user.gameInfo.winCnt + XMgr.user.gameInfo.failCnt && 3 == n[e]) continue;
                    if (XMgr.gameMgr.defenseFindRoomId.indexOf(n[e]) >= 0) continue;
                    let i = s.getRoomModel(n[e]);
                    i ? (i.doorModel && i.doorModel.isOpen || !i.doorModel) && (1 == i.bedModelList.length ? r.push(i) : i.bedModelList.length > 1 && o.push(i)) : console.log("FindEmptyBedAction not found room!")
                }
                if (i < .5) {
                    let [e, t] = this.findInOneBedRoom(r);
                    a = e, t && n.splice(n.indexOf(a.roomId), 1)
                } else {
                    let [e, t] = this.findInMoreBedRoom(o);
                    a = e, t && n.splice(n.indexOf(a.roomId), 1)
                }
            }
        }
        return a
            ? (
                s.setCurTarget(a),
                XMgr.gameMgr.defenseFindRoomId.indexOf(a.roomId) >= 0 ||
                XMgr.gameMgr.defenseFindRoomId.push(a.roomId),
                this.lastBed = a,
                true
            )
            : (
                s.setCurTarget(null),
                this.lastBed = void 0,
                false
            );
    }
    findInOneBedRoom(e) {
        if (0 == e.length) return [null, !1];
        XRandomUtil.randomArray(e);
        let t, i, s = e.length;
        for (; s--;) {
            let a = e[s].bedModelList[0];
            if (!a.isUsed) {
                t = a, i = !0;
                break
            }
        }
        return [t, i]
    }
    findInMoreBedRoom(e) {
        if (0 == e.length) return [null, !1];
        XRandomUtil.randomArray(e);
        let t, i = e.length,
            s = !1;
        for (; i--;) {
            let a, n = e[i],
                r = n.bedModelList.length;
            for (const e of n.bedModelList) e.isUsed ? r-- : a = e;
            if (r > 0 && (r--, t = a), 0 == r && t && (s = !0), t) break
        }
        return [t, s]
    }
}
XFindEmptyBedAct.register(XFindEmptyBedAct.NAME, XBTCategory.ACTION);

