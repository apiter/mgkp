import { math, v2, Vec2 } from "cc"
import EventCenter from "../event/EventCenter"
import { XEventNames } from "../event/XEventNames"
import { XRoomModel } from "../model/XRoomModel"
import { XBuildResult, XBuildType, XGameMode, XPlayerType } from "../xconfig/XEnum"
import XMgr from "../XMgr"
import { XRandomUtil } from "../xutil/XRandomUtil"
import XTowerModel from "../model/XTowerModel"
import XBuildingModel from "../model/XBuildingModel"
import XUtil from "../xutil/XUtil"

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
    superBuildCfg;
    specialTowerCfg = [];
    isInfiniteIncome = false

    mapBuildScripts: any[][] = []

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

        this.specialTowerCfg = Array.from(XMgr.cfg.allCfgMap.get("specialTowerCfg_test").values())
        // this.superBuildCfg = new fx.BaseDataModel("superBuildCfg_test", Lt)
        // this.specialTowerCfg = new fx.BaseDataModel("specialTowerCfg_test", Dt)
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


    getMapBuild(x_, y_) {
        if (this.mapBuildScripts && this.mapBuildScripts[x_]) return this.mapBuildScripts[x_][y_]
    }

    isBedInRoom(e, t, i) {
        for (const s of e.bedModelList)
            if (t == s.x && i == s.y) return true;
        return false
    }

    getEmptyGrids(e) {
        let arr: Vec2[] = []
        let room = this.getRoom(e);
        if (!room) return arr;
        for (const e of room.grids) {
            if (this.isBedInRoom(room, e.x, e.y) || room.doorPos.x == e.x && room.doorPos.y == e.y) continue;
            let s = this.getBuilding(e.x, e.y);
            s && !s.isDie || arr.push(e.clone())
        }
        return arr
    }

    build(i, buildId_, x_, y_, buildRot_ = 0, lv_ = 1, l = !0, h = !0, maxHp = null, u = !1) {
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
        let buildingModel = this.createBuildingModelByCfg(i, buildId_, p, lv_, x_, y_, buildRot_, c);
        maxHp && (buildingModel.curHp = buildingModel.maxHp = maxHp)
        buildingModel.isInit = u
        buildingModel.canHandle = h
        this.addBuilding(buildingModel, y)
        XMgr.playerMgr.player.type != XPlayerType.E_Defender && XMgr.mapMgr.setDynWalkable(x_, y_, !1)
        EventCenter.emit(XEventNames.E_BUILDING_BUILD, [buildingModel, !1])
        // !XMgr.taskMgr.compeletAllTask() && XMgr.taskMgr.startTask()
        // t.gameMgr.playSound(C, 111)
        return XBuildResult.E_OK
    }

    takeMapBuild(x_, y_, data_) {
        let a = this.getMapBuild(x_, y_);
        if (!a || a.isUsed) return !1;
        if (a.isUsed = !0, a.owner && !a.owner.destroyed) {
            this.mapBuildScripts[x_][y_] = null
            // if ("fhl" == a.buildName) {
            //     if (data_.uuid == XMgr.playerMgr.mineUuid) {
            //         let e = XMgr.cfg.constant.playerMoveSpeed;
            //         e /= XMgr.gameMgr.speedRatio, data_.ownerScript.moveSpeed = 4.5 * e
            //     }
            //     return false
            // }
            data_.takeMapBuild = a
            EventCenter.emit(XEventNames.E_MapBuild_take, [a, data_.uuid])
            return true
        }
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
                if (this.isIncludes(n, t.playerUuid)) return true;
                if (t.type == XBuildType.door) return true
            }
        return !1
    }

    isIncludes(arr_, ele_) {
        if (!ele_ || !arr_ || 0 == arr_.length) return false;
        for (const ele of arr_)
            if (ele_.includes(ele) || ele.includes(ele_)) return true;
        return false
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
        let roomEmptyGrids = XMgr.buildingMgr.getEmptyGrids(roomId_);
        if (0 == roomEmptyGrids.length) return;
        let a = v2(0, 0);
        if (i) {
            let e = 9999999;
            for (const grid of roomEmptyGrids) {
                let dis = i.distanceSq(grid);
                if (dis < e) {
                    e = dis
                    a.x = grid.x
                    a.y = grid.y
                }
            }
            return a
        }
        const randGrid = XRandomUtil.randomInArray(roomEmptyGrids);
        a.x = randGrid.x
        a.y = randGrid.y
        return a
    }

    addCfgs(name_, type_?) {
        let cfg = XMgr.cfg.allCfgMap.get(name_);
        if (!cfg) return;
        for (const key of cfg.keys()) {
            let cfgItem = cfg[key];
            cfgItem.id = cfgItem.buildId
            cfgItem.type = type_ || cfgItem.buildType
            this.buildCfgs[cfgItem.id] || (this.buildCfgs[cfgItem.id] = [])
            this.buildIdsMap[cfgItem.type] || (this.buildIdsMap[cfgItem.type] = [])
            this.buildCfgs[cfgItem.id].push(cfgItem)
            this.buildIdsMap[cfgItem.type].push(cfgItem.id)
            cfgItem.lv = this.buildCfgs[cfgItem.id].length
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

    upBed(x_: number, y_: number, player_: any) {
        // 获取当前床建筑 & 所在房间
        const bed = this.getBuilding(x_, y_);
        const room = bed ? this.getRoom(bed.roomId) : null;

        // 基础检查
        if (!bed || bed.type !== XBuildType.bed || !room) {
            return XBuildResult.E_FAILD;
        }
        if (bed.isUsed) {
            return XBuildResult.E_BED_IS_USED;
        }

        // 遍历房间内所有建筑
        for (const building of room.buildings) {
            // 绑定玩家 UUID
            building.playerUuid = player_.uuid;

            // 特殊床位处理（id=2000 且为自己玩家）
            if (building.id === 2000 && player_.uuid === XMgr.playerMgr.player.uuid) {
                const buffData = XMgr.user.gameInfo.getBuffData(21);
                if (buffData) {
                    const buffCfg = XMgr.cfg.buffCfg.get("21");
                    const buffValue = buffCfg.values[buffData.lv];
                    building.maxHp = building.curHp = Math.round(building.maxHp * (buffValue / 100 + 1));
                }
            }
            // 玩家本身 buff 处理（防守模式下）
            else if (player_.uuid === XMgr.playerMgr.player.uuid) {
                const buildCfg = XMgr.buildingMgr.getBuildCfg(building.id);

                if (XMgr.gameMgr.gameMode === XGameMode.E_Defense && buildCfg.buffId) {
                    for (const buffId of buildCfg.buffId) {
                        if (XMgr.user.gameInfo.getBuffData(buffId)) {
                            if (buildCfg.buffIcon || buildCfg.buffBuildAni) {
                                building.ownerScript.initSkin();
                                building.ownerScript.clearEffects();
                                building.ownerScript.initEffects();
                            }
                            break;
                        }
                    }
                }
            }
        }

        // 设置床状态 & 玩家状态
        bed.isUsed = true;
        player_.isBed = true;
        player_.bedModel = bed;

        // 房间内玩家列表
        if (!room.players) {
            room.players = [];
        }
        room.players.push(player_);

        // 关闭房间门
        const door = this.getBuilding(room.doorPos.x, room.doorPos.y);
        if (door && door.canHandle) {
            this.closeDoorByGridPos(room.doorPos.x, room.doorPos.y);
        }

        // 触发上床事件
        EventCenter.emit(XEventNames.E_Bed_Up, [bed, player_.uuid])

        // 搬建筑逻辑
        if (player_.takeMapBuild) {
            const buildCfg = player_.takeMapBuild.buildCfg;
            const emptyGrids = this.getEmptyGrids(room.id);
            const randPos = XRandomUtil.randomInArray(emptyGrids);
            this.buildCd(player_.uuid, buildCfg.buildId, randPos.x, randPos.y, 0, buildCfg.lv);
        }

        return XBuildResult.E_OK;
    }

    closeDoorByGridPos(t, i) {
        let s = this.getBuilding(t, i);
        if (!s || s.type != XBuildType.door) return XBuildResult.E_FAILD;
        this.changeDoorState(s, false)
    }

    buildCd(i, s, a, n, r = 0, o = 1, l = !0) {
        // 检查当前位置是否已有建筑
        let h = this.getBuilding(a, n);
        if (h && !h.isDie) {
            return XBuildResult.E_FAILD;
        }

        // 获取建造配置（特殊建筑 7777 映射到 3000）
        let d = this.getBuildCfg(s, o);
        if (s == 7777) {
            d = this.getBuildCfg(3000, o);
        }
        if (!d) {
            return;
        }

        let u; // 新建筑实例
        let g = XMgr.mapMgr.getRoomIdByGrid(a, n);   // 房间 ID
        let c = XMgr.playerMgr.getPlayer(i);         // 玩家对象

        // 处理特殊建筑逻辑
        if (s == 7777) {
            u = this.createBuildingModelByCfg(i, 3000, g, o, a, n, r, d);
            u.isSpecial = true;

            let e = this.getSpecialTower();
            u.specialId = e.id;

            if (e.quality == "罕见") {
                u.canChangeSpecial = true;
            }
        } else {
            // 普通建筑
            u = this.createBuildingModelByCfg(i, s, g, o, a, n, r, d);
        }

        // 设置可操作属性
        u.canHandle = l;

        // 添加建筑到地图 & 玩家
        this.addBuilding(u, c);

        // 如果是进攻方，则格子不可通行
        if (XMgr.playerMgr.player.type != XPlayerType.E_Defender) {
            XMgr.mapMgr.setDynWalkable(a, n, false);
        }

        // 派发建造事件
        EventCenter.emit(XEventNames.E_BUILDING_BUILD, [u, false, 60]);
        // 任务检查
        // if (!XMgr.taskMgr.compeletAllTask()) {
        //     XMgr.taskMgr.startTask();
        // }

        // 播放音效
        return XBuildResult.E_OK;
    }

    getSpecialTower(e = !1) {
        let towers = [];
        this.specialTowerCfg.forEach(e => {
            towers.push(e)
        })
        e ? towers.splice(0, 5) : 8 * XRandomUtil.getNumberRandom(0, 1) < 6 ? towers.splice(5) : towers.splice(0, 5);
        let selectedTowers:{tower:any, weight:number}[] = [];
        for (const tower of towers)
            e ? "罕见" != tower.quality && selectedTowers.push({
                tower: tower,
                weight: tower.weight
            }) : selectedTowers.push({
                tower: tower,
                weight: tower.weight
            });
        return XUtil.takeOneByWeight(selectedTowers).tower
    }

}