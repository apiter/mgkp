import { XBTCondition } from "../bt2/XBTCondition";
import { XBTCategory } from "../bt2/XBTEnum";
import { XPlayerScript } from "../view/player/XPlayerScript";
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
    satisfy(data_) {
        let isBedUsed, playerScript = data_.target as XPlayerScript;
        let lastBed = this.lastBed;

        if (!this.lastBed || (isBedUsed = playerScript.isBedUsed(this.lastBed))) {
            let n = data_.blackboard.get(XFindEmptyBedAct.NAME);

            if (!n || n.length === 0) {
                n = playerScript.getAllRoomIdRand();
                data_.blackboard.set(XFindEmptyBedAct.NAME, n);
            }

            lastBed = null;

            if (isBedUsed) {
                let roomModel = playerScript.getRoomModel(this.lastBed.roomId);
                let [t, i] = this.findInMoreBedRoom([roomModel]);
                lastBed = t;
                if (i && t) {
                    n.splice(n.indexOf(lastBed.roomId), 1);
                }
            }

            if (!lastBed) {
                let e = n.length,
                    i = XRandomUtil.random(),
                    r: any[] = [],
                    o: any[] = [];

                for (; e--;) {
                    if (XMgr.user.gameInfo.winCnt + XMgr.user.gameInfo.failCnt === 0 && n[e] === 3) continue;
                    if (XMgr.gameMgr.defenseFindRoomId.indexOf(n[e]) >= 0) continue;

                    let room = playerScript.getRoomModel(n[e]);
                    if (room) {
                        if ((room.doorModel && room.doorModel.isOpen) || !room.doorModel) {
                            if (room.bedModelList.length === 1) r.push(room);
                            else if (room.bedModelList.length > 1) o.push(room);
                        }
                    } else {
                        console.log("FindEmptyBedAction not found room!");
                    }
                }

                if (i < 0.5) {
                    let [e, t] = this.findInOneBedRoom(r);
                    lastBed = e;
                    if (t) n.splice(n.indexOf(lastBed.roomId), 1);
                } else {
                    let [e, t] = this.findInMoreBedRoom(o);
                    lastBed = e;
                    if (t) n.splice(n.indexOf(lastBed.roomId), 1);
                }
            }
        }

        if (lastBed) {
            playerScript.setCurTarget(lastBed);
            if (XMgr.gameMgr.defenseFindRoomId.indexOf(lastBed.roomId) < 0) {
                XMgr.gameMgr.defenseFindRoomId.push(lastBed.roomId);
            }
            this.lastBed = lastBed;
            return true;
        } else {
            playerScript.setCurTarget(null);
            this.lastBed = void 0;
            return false;
        }
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

    findInMoreBedRoom(rooms) {
        if (rooms.length === 0) return [null, false];  // 没有房间

        XRandomUtil.randomArray(rooms);

        let retBed;                // 选中的床
        let roomCnt = rooms.length;
        let isFind = false;   // 是否找到可用的房间

        while (roomCnt--) {
            let curBed;                      // 临时记录一个未使用的床
            let room = rooms[roomCnt];           // 当前房间
            let bedLength = room.bedModelList.length; // 当前房间床数量

            for (const bed of room.bedModelList) {
                if (bed.isUsed) {
                    bedLength--;  // 已使用的床，数量减掉
                } else {
                    curBed = bed;  // 记录一个没用的床（最后会是房间里最后一个空床）
                }
            }

            // 如果有可用床，先记录下来
            if (bedLength > 0) {
                bedLength--;
                retBed = curBed; // 把这个床作为候选
            }

            // 如果只剩最后一张空床，并且找到了候选床
            if (bedLength === 0 && retBed) {
                isFind = true;
            }

            // 已经找到就跳出循环
            if (retBed) break;
        }

        return [retBed, isFind];
    }

}
XFindEmptyBedAct.register(XFindEmptyBedAct.NAME, XBTCategory.ACTION);

