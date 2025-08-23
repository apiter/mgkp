import { math, v2 } from "cc"
import EventCenter from "../event/EventCenter"
import { XEventNames } from "../event/XEventNames"
import { XRoomModel } from "../model/XRoomModel"
import { XBuildResult, XBuildType, XGameMode } from "../xconfig/XEnum"
import XMgr from "../XMgr"
import { XRandomUtil } from "../xutil/XRandomUtil"
import XTowerModel from "../model/XTowerModel"
import XBuildingModel from "../model/XBuildingModel"

export default class XBuildingMgr {
    isAddCfg: boolean = false
    buildCfgs: { [key: string]: any } = {}
    buildIdsMap: { [key: string]: any } = {}
    dawnBed: any[] = []
    mapBuildArr: string[] = []
    mapBuildWeightArr: number[] = []
    magicConsumeArr: number[][] = []

    buildings: any[] = []
    buildingGrids: any[] = []
    turntableBuildArr: any[] = []
    mapEquipScripts: any[] = []
    mapEquipScriptArr: any[] = []
    rooms: { [key: string]: XRoomModel } = {}
    superBuildCfg
    specialTowerCfg
    constructor() {
        this.mapBuildArr = ["5002_1", "4000_3", "4000_2", "4000_1", "6017_1", "5000_2", "5000_1", "5003_1", "5004_1", "5005_1", "3008_1", "3009_1", "fhl_1", "7777_1", "3006_1", "6023_1"],
            this.mapBuildWeightArr = [12, 1, 3, 5, 5, 1, 5, 10, 18, 25, 5, 2, 6, 2, 10, 5],
            this.magicConsumeArr = [
                [10, 0],
                [40, 10],
                [160, 10],
                [240, 30]
            ]
    }


    initBuildingCfg() {
        if (this.isAddCfg) return;
        this.isAddCfg = true
        this.addCfgs("bedCfg", XBuildType.bed)
        this.addCfgs("doorCfg", XBuildType.door)
        this.addCfgs("towerCfg_test", XBuildType.tower)
        this.addCfgs("energyMachineCfg", XBuildType.energy)
        this.addCfgs("mineCfg_test", XBuildType.mine)
        this.addCfgs("skillBuildCfg_test")
        this.superBuildCfg = new fx.BaseDataModel("superBuildCfg_test", Lt)
        this.specialTowerCfg = new fx.BaseDataModel("specialTowerCfg_test", Dt)
    }

    init() {
        this.initBuildingCfg()
        this.buildings = []
        this.buildingGrids = []
        this.turntableBuildArr = []
        this.mapEquipScripts = []
        this.mapEquipScriptArr = []
        this.rooms = {};
        for (const room of XMgr.mapMgr.rooms) this.rooms[room.id] = room;
        let i = XMgr.mapMgr.buildings.slice(0),
            s = [];
        for (const e of i) {
            let t = this.getRoom(e.roomId);
            if (t?.active) {
                s.push(e)
                this.build(null, e.buildId, e.x, e.y, e.buildRot, e.lv, !1)
            }
        }
        this.openAllDoor()
        this.initRandomBuild()
        // XMgr.gameMgr.gameMode == XGameMode.E_Defense ? this.initRandomBuild() : XMgr.gameMgr.gameMode == XGameMode.E_Hunt ? this.initHunterRandomBuild() : t.gameMgr.gameMode == XGameMode.E_SevenGhost && this.initSevenGhostRandomBuild()
    }

    initRandomBuild() {
        let e = 100 / 95,
            t = [5001, 6012, 3e3, 3004, 3001, 6005, 6001, 6013, 6019, 4e3, 6006];
        for (const i in this.rooms) {
            let s, a = this.rooms[i],
                n = a.bedModelList[0],
                r = v2(n.x, n.y),
                o = this.getGridByPos(a.id, r),
                l = XRandomUtil.random(),
                h = t[s = l < .25 * e ? 0 : l < .4 * e ? 1 : l < .45 * e ? 2 : l < .5 * e ? 3 : l < .55 * e ? 4 : l < .67 * e ? 5 : l < .79 * e ? 6 : l < .83 * e ? 7 : l < .85 * e ? 8 : l < .9 * e ? 9 : 10],
                d = this.getBuildCfg(h);
            this.build(null, d.buildId, o.x, o.y, 0, 1, !1, !0, null, !0)
        }
    }


    isBedInRoom(e, t, i) {
        for (const s of e.bedModelList)
            if (t == s.x && i == s.y) return true;
        return false
    }

    getEmptyGrids(e) {
        let t = []
        let room = this.getRoom(e);
        if (!room) return t;
        for (const e of room.grids) {
            if (this.isBedInRoom(room, e.x, e.y) || room.doorPos.x == e.x && room.doorPos.y == e.y) continue;
            let s = this.getBuilding(e.x, e.y);
            s && !s.isDie || t.push(e.clone())
        }
        return t
    }

    build(i, buildId_, x_, y_, buildRot_ = 0, lv_ = 1, l = !0, h = !0, d, u = !1) {
        let g = this.getBuilding(x_, y_);
        if (g && !g.isDie) return XBuildResult.E_FAILD;
        let c = this.getBuildCfg(buildId_, lv_);
        if (!c) return;
        let p = XMgr.mapMgr.getRoomIdByGrid(x_, y_),
            f = c.coin,
            m = c.energy,
            y = XMgr.playerMgr.getPlayer(i);
        if (6666 == c.buildId)
            if (XMgr.gameMgr.gameMode == XGameMode.E_Hunt || 1 == XMgr.gameMgr.difficultABTest && XMgr.gameMgr.gameMode == XGameMode.E_Defense)
                if (XMgr.playerMgr.mineUuid == i) {
                    let e = math.clamp(XMgr.gameMgr.randomCnt, 0, 3);
                    f = this.magicConsumeArr[e][0], m = this.magicConsumeArr[e][1]
                } else {
                    let e = math.clamp(y.randomCnt, 0, 3);
                    f = this.magicConsumeArr[e][0], m = this.magicConsumeArr[e][1]
                } else f = this.magicConsumeArr[XMgr.gameMgr.randomCnt][0], m = this.magicConsumeArr[XMgr.gameMgr.randomCnt][1];
        else XMgr.gameMgr.gameMode == XGameMode.E_Defense && c.buffId && c.buffId.includes(1) && XMgr.user.gameInfo.getBuffData(1) && (f = Math.round(.9 * c.coin), m = Math.round(.9 * c.energy));
        if (p && y && l) {
            let a = this.getRoom(p),
                n = this.getBuildCntInRoom(a, buildId_);
            if (c.maxCnt && n >= c.maxCnt) return XBuildResult.E_MAX_CNT;
            if (!this.isInfiniteIncome && f && f > y.coin) return XBuildResult.E_COIN_NOT_ENOUGH;
            if (!this.isInfiniteIncome && m && m > y.energy) return XBuildResult.E_ENERGY_NOT_ENOUGH;
            if (c.preBuilding && !this.isHaveBuilding(p, c.preBuilding.buildId, c.preBuilding.lv)) return XBuildResult.E_NOT_HAVE_PREBUILD;
            this.isInfiniteIncome ? XMgr.playerMgr.changePlayerIncomeByUuid(i, f, m) : XMgr.playerMgr.changePlayerIncomeByUuid(i, -f, -m)
        }
        let C = this.createBuildingModelByCfg(i, buildId_, p, lv_, x_, y_, buildRot_, c);
        return d && (C.curHp = C.maxHp = d), C.isInit = u, C.canHandle = h, this.addBuilding(C, y), t.playerMgr.player.type != e.PlayerType.E_Defender && t.mapMgr.setDynWalkable(x_, y_, !1), fx.EventCenter.I.event(XEventNames.E_BUILDING_BUILD, [C, !1]), !t.taskMgr.compeletAllTask() && t.taskMgr.startTask(), t.gameMgr.playSound(C, 111), e.BuildResult.E_OK
    }

    
    createBuildingModelByCfg(i, s, a, n, r, o, l, h) {
        let d;
        switch (h.type) {
            case XBuildType.tower:
                let t = d = new XTowerModel(s, a, n, r, o, l),
                    i = h;
                t.atkCD = i.atkInterval, t.atkDst = i.atkRange, t.atk = i.atkDamage;
                break;
            default:
                d = new XBuildingModel(s, a, n, r, o, l)
        }
        d.playerUuid = i, d.lv = n, d.type = h.type;
        let u = h.hp || 1;
        return XMgr.gameMgr.changeMaxHp(d, u, u), d
    }
    
    isHaveBuilding(t, i, s = 1) {
        let a = this.getRoom(t),
            n = [];
        for (const e of a.bedModelList) e && !e.isDie && e.playerUuid && n.push(e.playerUuid);
        for (const t of a.buildings)
            if (t.id == i && t.lv >= s) {
                if (this.aaa(n, t.playerUuid)) return true;
                if (t.type == XBuildType.door) return true
            }
        return !1
    }

    getBuildCntInRoom(e, t) {
        if (!e) return 0;
        let i = 0;
        for (const s of e.buildings) s.id == t && i++;
        return i
    }

    addBuilding(building, owner) {
        // 全局建筑列表
        this.buildings.push(building);

        // 建筑格子映射
        if (!this.buildingGrids[building.x]) {
            this.buildingGrids[building.x] = [];
        }
        this.buildingGrids[building.x][building.y] = building;

        // 加入所属房间
        let room = this.getRoom(building.roomId);
        if (room) {
            room.buildings.push(building);

            if (building.type === XBuildType.bed) {
                // 特殊床位
                if (building.id === 1000) {
                    room.bedModelList.push(building);
                }
            } else if (building.type === XBuildType.door) {
                // 房间的门
                room.doorModel = building;
                room.doorPos = v2(building.x, building.y);
            } else if (building.type === XBuildType.tower) {
                // 特殊塔
                if (building.id === 3000) {
                    room.towers.push(building);
                }
            }
        }

        // 加入所属玩家/阵营
        if (owner) {
            owner.buildings.push(building);
        }
    }


    getBuilding(e, t) {
        if (this.buildingGrids[e]) return this.buildingGrids[e][t]
    }

    getGridByPos(roomId_, i) {
        let s = XMgr.buildingMgr.getEmptyGrids(roomId_);
        if (0 == s.length) return;
        let a = v2(0, 0);
        if (i) {
            let e = 9999999;
            for (const t of s) {
                let s = i.distanceSq(t);
                s < e && (e = s, a.from(t))
            }
        } else a.from(XRandomUtil.randomInArray(s));
        return a
    }

    addCfgs(name_, type_) {
        let i = fx.CfgMgr.instance.get(name_);
        for (const e in i) {
            let s = i[e];
            s.id = s.buildId, s.type = type_ || s.buildType, this.buildCfgs[s.id] || (this.buildCfgs[s.id] = []), this.buildIdsMap[s.type] || (this.buildIdsMap[s.type] = []), this.buildCfgs[s.id].push(s), this.buildIdsMap[s.type].push(s.id), s.lv = this.buildCfgs[s.id].length
        }
    }

    getRoom(roomID) {
        return this.rooms[roomID]
    }


    getBuildCfg(e, t = 1) {
        if (this.buildCfgs[e]) {
            const list = this.buildCfgs[e];
            const index = Math.min(t, list.length) - 1;
            return list[index];
        }
    }

    openAllDoor() {
        let t = this.buildings;
        for (const i of t) {
            this.getBuildCfg(i.id).type == XBuildType.door && this.changeDoorState(i, !0)
        }
    }

    changeDoorState(e, isOpen_) {
        e.isOpen = isOpen_
        XMgr.mapMgr.setDynWalkable(e.x, e.y, isOpen_)
        EventCenter.emit(XEventNames.E_Door_State_Changed, [e])
    }
}