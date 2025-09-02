import { log, math, v2, Vec2 } from "cc"
import EventCenter from "../event/EventCenter"
import { XEventNames } from "../event/XEventNames"
import { XRoomModel } from "../model/XRoomModel"
import { XBuildResult, XBuildType, XGameMode, XPlayerType } from "../xconfig/XEnum"
import XMgr from "../XMgr"
import { XRandomUtil } from "../xutil/XRandomUtil"
import XTowerModel from "../model/XTowerModel"
import XBuildingModel from "../model/XBuildingModel"
import XUtil from "../xutil/XUtil"
import XPlayerModel from "../model/XPlayerModel"
import { XBuildingScript } from "../view/building/XBuildingScript"

export default class XBuildingMgr {
    isAddCfg: boolean = false
    buildCfgs: { [key: string]: any } = {}
    buildIdsMap: { [key: string]: any } = {}
    dawnBed: any[] = []
    mapBuildArr: string[] = []
    mapBuildWeightArr: number[] = []
    magicConsumeArr: number[][] = []

    buildings: XBuildingModel[] = []
    buildingGrids: XBuildingModel[][] = []
    turntableBuildArr: any[] = []
    mapEquipScripts: any[] = []
    mapEquipScriptArr: any[] = []
    rooms: { [key: string]: XRoomModel } = {}
    superBuildCfg;
    specialTowerCfg = [];
    isInfiniteIncome = false

    mapBuildScripts: any[][] = []
    mapBuildScriptArr: XBuildingScript[] = []

    constructor() {
        this.mapBuildArr = ["5002_1", "4000_3", "4000_2", "4000_1", "6017_1", "5000_2", "5000_1", "5003_1", "5004_1", "5005_1", "3008_1", "3009_1", "fhl_1", "7777_1", "3006_1", "6023_1"]
        this.mapBuildWeightArr = [12, 1, 3, 5, 5, 1, 5, 10, 18, 25, 5, 2, 6, 2, 10, 5]
        this.magicConsumeArr = [
            [10, 0], [40, 10], [160, 10], [240, 30]
        ]
    }

    init() {
        this.initBuildingCfg()
        this.buildings = []
        this.buildingGrids = []
        this.turntableBuildArr = []
        this.mapEquipScripts = []
        this.mapEquipScriptArr = []
        this.rooms = {};
        for (const room of XMgr.mapMgr.rooms)
            this.rooms[room.id] = room;
        let buildings = XMgr.mapMgr.buildings.slice(0)
        for (const e of buildings) {
            let t = this.getRoom(e.roomId);
            if (t?.active) {
                this.build(null, e.buildId, e.x, e.y, e.buildRot, e.lv, !1)
            }
        }
        this.openAllDoor()
        this.initRandomBuild()
        // XMgr.gameMgr.gameMode == XGameMode.E_Defense ? this.initRandomBuild() : XMgr.gameMgr.gameMode == XGameMode.E_Hunt ? this.initHunterRandomBuild() : t.gameMgr.gameMode == XGameMode.E_SevenGhost && this.initSevenGhostRandomBuild()
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

        this.specialTowerCfg = Array.from(XMgr.cfg.superBuildCfg.values())
    }

    initRandomBuild() {
        let e = 100 / 95,
            t = [5001, 6012, 3e3, 3004, 3001, 6005, 6001, 6013, 6019, 4e3, 6006];
        for (const i in this.rooms) {
            let room = this.rooms[i],
                n = room.bedModelList[0],
                pos = v2(n.x, n.y),
                grid = this.getGridByPos(room.id, pos),
                h = t[0]
            let buildCfg = this.getBuildCfg(h);
            this.build(null, buildCfg.buildId, grid.x, grid.y, 0, 1, false, true, null, true)
        }
    }


    getMapBuild(x_, y_) {
        if (this.mapBuildScripts && this.mapBuildScripts[x_]) return this.mapBuildScripts[x_][y_]
    }

    isBedInRoom(room, gridX_, gridY_) {
        for (const roomBed of room.bedModelList)
            if (gridX_ == roomBed.x && gridY_ == roomBed.y)
                return true;
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

    build(playerID, buildId_, x_, y_, buildRot_ = 0, lv_ = 1, check = true, canHandle_ = true, maxHp = null, isInit_ = false) {
        // 检查目标格子是否已有建筑
        const buildModel = this.getBuilding(x_, y_);
        if (buildModel && !buildModel.isDie) return XBuildResult.E_FAILD;

        // 获取建造配置
        let buildCfg = this.getBuildCfg(buildId_, lv_);
        if (!buildCfg) return;

        const roomId = XMgr.mapMgr.getRoomIdByGrid(x_, y_);
        let consumeCoin = buildCfg.coin;      // 消耗金币
        let consumeEnergy = buildCfg.energy;    // 消耗能量
        const playerModel = XMgr.playerMgr.getPlayer(playerID);

        // 特殊建造（6666：魔法消耗）
        if (6666 == buildCfg.buildId) {
            if (XMgr.gameMgr.gameMode == XGameMode.E_Hunt ||
                (1 == XMgr.gameMgr.difficultABTest && XMgr.gameMgr.gameMode == XGameMode.E_Defense)) {
                // 自己
                if (XMgr.playerMgr.mineUuid == playerID) {
                    const e = math.clamp(XMgr.gameMgr.randomCnt, 0, 3);
                    consumeCoin = this.magicConsumeArr[e][0];
                    consumeEnergy = this.magicConsumeArr[e][1];
                }
                // 其他人
                else {
                    const e = math.clamp(playerModel.randomCnt, 0, 3);
                    consumeCoin = this.magicConsumeArr[e][0];
                    consumeEnergy = this.magicConsumeArr[e][1];
                }
            } else {
                consumeCoin = this.magicConsumeArr[XMgr.gameMgr.randomCnt][0];
                consumeEnergy = this.magicConsumeArr[XMgr.gameMgr.randomCnt][1];
            }
        }
        // 防御模式 buff 折扣
        // else if (XMgr.gameMgr.gameMode == XGameMode.E_Defense && buildCfg.buffId && buildCfg.buffId.indexOf(1) >= 0 && XMgr.user.gameInfo.getBuffData(1)) {
        //     consumeCoin = Math.round(0.9 * buildCfg.coin);
        //     consumeEnergy = Math.round(0.9 * buildCfg.energy);
        // }

        // 建造前的限制检查
        if (roomId && playerModel && check) {
            const room = this.getRoom(roomId);
            const buildCntInRoom = this.getBuildCntInRoom(room, buildId_);

            if (buildCfg.maxCnt && buildCntInRoom >= buildCfg.maxCnt) return XBuildResult.E_MAX_CNT;
            if (!this.isInfiniteIncome && consumeCoin && consumeCoin > playerModel.coin) return XBuildResult.E_COIN_NOT_ENOUGH;
            if (!this.isInfiniteIncome && consumeEnergy && consumeEnergy > playerModel.energy) return XBuildResult.E_ENERGY_NOT_ENOUGH;
            if (buildCfg.preBuilding && !this.isHaveBuilding(roomId, buildCfg.preBuilding.buildId, buildCfg.preBuilding.lv))
                return XBuildResult.E_NOT_HAVE_PREBUILD;

            // 扣除资源
            if (this.isInfiniteIncome) {
                XMgr.playerMgr.changePlayerIncomeByUuid(playerID, consumeCoin, consumeEnergy);
            } else {
                XMgr.playerMgr.changePlayerIncomeByUuid(playerID, -consumeCoin, -consumeEnergy);
            }
        }

        // 创建建筑实例
        const buildingModel = this.createBuildingModelByCfg(playerID, buildId_, roomId, lv_, x_, y_, buildRot_, buildCfg);
        if (maxHp) buildingModel.curHp = buildingModel.maxHp = maxHp;

        buildingModel.isInit = isInit_;
        buildingModel.canHandle = canHandle_;

        // 加入房间/玩家
        this.addBuilding(buildingModel, playerModel);

        // 更新寻路
        if (XMgr.playerMgr.player.type != XPlayerType.E_Defender) {
            XMgr.mapMgr.setDynWalkable(x_, y_, !1);
        }

        // 广播事件
        EventCenter.emit(XEventNames.E_BUILDING_BUILD, buildingModel, false);

        // 任务/音效（目前注释掉）
        // !XMgr.taskMgr.compeletAllTask() && XMgr.taskMgr.startTask();
        // t.gameMgr.playSound(C, 111);

        return XBuildResult.E_OK;
    }

    buildFree(playerId_, buildId_, gridX_, gridY_, rotation_ = 0, buildMinLv_ = 1, canHandle_ = true, specialTowerIdx_ = null) {
        let buildModel = this.getBuilding(gridX_, gridY_);
        if (buildModel && !buildModel.isDie)
            return XBuildResult.E_FAILD;

        let buildCfg = this.getBuildCfg(buildId_, buildMinLv_);
        //TODO special
        if (!buildCfg) return;

        let roomId = XMgr.mapMgr.getRoomIdByGrid(gridX_, gridY_); // 房间id
        let player = XMgr.playerMgr.getPlayer(playerId_);       // 玩家

        if (buildId_ == 7777) {
            buildModel = this.createBuildingModelByCfg(playerId_, 3000, roomId, buildMinLv_, gridX_, gridY_, rotation_, buildCfg);
            buildModel.isSpecial = true;

            if (!specialTowerIdx_ || specialTowerIdx_ > XMgr.buildingMgr.specialTowerCfg.length) {
                buildModel.specialId = this.getSpecialTower().id;
            } else {
                buildModel.specialId = specialTowerIdx_;
            }
        } else {
            buildModel = this.createBuildingModelByCfg(playerId_, buildId_, roomId, buildMinLv_, gridX_, gridY_, rotation_, buildCfg);
        }

        buildModel.canHandle = canHandle_;

        this.addBuilding(buildModel, player);

        if (XMgr.playerMgr.player.type != XPlayerType.E_Defender) {
            XMgr.mapMgr.setDynWalkable(gridX_, gridY_, false);
        }

        EventCenter.emit(XEventNames.E_BUILDING_BUILD, buildModel, false);

        return XBuildResult.E_OK;
    }


    addBuilding(building: XBuildingModel, owner: XPlayerModel) {
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

    takeMapBuild(x_, y_, data_) {
        let build = this.getMapBuild(x_, y_);
        if (!build || build.isUsed) return false;
        if (build.isUsed = !0, build.owner && !build.owner.destroyed) {
            this.mapBuildScripts[x_][y_] = null
            // if ("fhl" == a.buildName) {
            //     if (data_.uuid == XMgr.playerMgr.mineUuid) {
            //         let e = XMgr.cfg.constant.playerMoveSpeed;
            //         e /= XMgr.gameMgr.speedRatio, data_.ownerScript.moveSpeed = 4.5 * e
            //     }
            //     return false
            // }
            data_.takeMapBuild = build
            EventCenter.emit(XEventNames.E_MapBuild_take, build, data_.uuid)
            return true
        }
    }


    createBuildingModelByCfg(playerUuid_: string, id_: number, roomId_: number, lv_: number, x_: number, y_: number, rotation_: number, buildCfg) {
        let model: XBuildingModel;
        switch (buildCfg.type) {
            case XBuildType.tower:
                let t = model = new XTowerModel(id_, roomId_, lv_, x_, y_, rotation_),
                    i = buildCfg;
                t.atkCD = i.atkInterval
                t.atkDst = i.atkRange
                t.atk = i.atkDamage;
                break;
            default:
                model = new XBuildingModel(id_, roomId_, lv_, x_, y_, rotation_)
        }
        model.playerUuid = playerUuid_
        model.lv = lv_
        model.type = buildCfg.type;
        let u = buildCfg.hp || 1;
        XMgr.gameMgr.changeMaxHp(model, u, u)
        return model
    }

    isHaveBuilding(roomId_, buildId_, lv_ = 1) {
        let room = this.getRoom(roomId_)
        let uuids = [];
        for (const bedModel of room.bedModelList)
            bedModel && !bedModel.isDie && bedModel.playerUuid && uuids.push(bedModel.playerUuid);
        for (const build of room.buildings)
            if (build.id == buildId_ && build.lv >= lv_) {
                if (uuids.indexOf(build.playerUuid) >= 0)
                    return true;
                if (build.type == XBuildType.door)
                    return true
            }
        return false
    }

    isIncludes(arr_, ele_) {
        if (!ele_ || !arr_ || 0 == arr_.length) return false;
        for (const ele of arr_)
            if (ele_.includes(ele) || ele.includes(ele_)) return true;
        return false
    }

    getBuildCntInRoom(room_, buildId_) {
        if (!room_) return 0;
        let cnt = 0;
        for (const build of room_.buildings) build.id == buildId_ && cnt++;
        return cnt
    }

    getBuilding(gridX_, gridY_) {
        if (this.buildingGrids[gridX_])
            return this.buildingGrids[gridX_][gridY_]
    }

    getGridByPos(roomId_, i) {
        let roomEmptyGrids = XMgr.buildingMgr.getEmptyGrids(roomId_);
        if (0 == roomEmptyGrids.length) return;
        let a = v2(0, 0);
        if (i) {
            let e = 9999999;
            for (const grid of roomEmptyGrids) {
                let dis = Vec2.squaredDistance(i, grid)
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
        for (const key in cfg) {
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

    getBuildCfg(buildId_, minIdx_ = 1) {
        if (this.buildCfgs[buildId_]) {
            const list = this.buildCfgs[buildId_];
            const index = Math.min(minIdx_, list.length) - 1;
            return list[index];
        }
    }

    openAllDoor() {
        let t = this.buildings;
        for (const i of t) {
            this.getBuildCfg(i.id).type == XBuildType.door && this.changeDoorState(i, !0)
        }
    }

    changeDoorState(door:XBuildingModel, isOpen_) {
        door.isOpen = isOpen_
        XMgr.mapMgr.setDynWalkable(door.x, door.y, isOpen_)
        EventCenter.emit(XEventNames.E_Door_State_Changed, door)
    }

    upBed(x_: number, y_: number, player_: XPlayerModel) {
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
                // if (buffData) {
                //     const buffCfg = XMgr.cfg.buffCfg.get("21");
                //     const buffValue = buffCfg.values[buffData.lv];
                //     building.maxHp = building.curHp = Math.round(building.maxHp * (buffValue / 100 + 1));
                // }
            }
            // 玩家本身 buff 处理（防守模式下）
            else if (player_.uuid === XMgr.playerMgr.player.uuid) {
                const buildCfg = XMgr.buildingMgr.getBuildCfg(building.id);

                if (XMgr.gameMgr.gameMode === XGameMode.E_Defense && buildCfg.buffId) {
                    for (const buffId of buildCfg.buffId) {
                        // if (XMgr.user.gameInfo.getBuffData(buffId)) {
                        //     if (buildCfg.buffIcon || buildCfg.buffBuildAni) {
                        //         building.ownerScript.initSkin();
                        //         building.ownerScript.clearEffects();
                        //         building.ownerScript.initEffects();
                        //     }
                        //     break;
                        // }
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
        EventCenter.emit(XEventNames.E_Bed_Up, bed, player_.uuid)

        // 搬建筑逻辑
        // if (player_.takeMapBuild) {
        //     const buildCfg = player_.takeMapBuild.buildCfg;
        //     const emptyGrids = this.getEmptyGrids(room.id);
        //     const randPos = XRandomUtil.randomInArray(emptyGrids);
        //     this.buildCd(player_.uuid, buildCfg.buildId, randPos.x, randPos.y, 0, buildCfg.lv);
        // }

        return XBuildResult.E_OK;
    }

    closeDoorByGridPos(t, i) {
        let s = this.getBuilding(t, i);
        if (!s || s.type != XBuildType.door) return XBuildResult.E_FAILD;
        this.changeDoorState(s, false)
    }

    buildCd(i, s, a, n, r = 0, o = 1, canHandle_ = !0) {
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

        let buildModel: XBuildingModel; // 新建筑实例
        let roomId = XMgr.mapMgr.getRoomIdByGrid(a, n);   // 房间 ID
        let playModel = XMgr.playerMgr.getPlayer(i);         // 玩家对象

        // 处理特殊建筑逻辑
        if (s == 7777) {
            buildModel = this.createBuildingModelByCfg(i, 3000, roomId, o, a, n, r, d);
            buildModel.isSpecial = true;

            let e = this.getSpecialTower();
            buildModel.specialId = e.id;

            if (e.quality == "罕见") {
                buildModel.canChangeSpecial = true;
            }
        } else {
            // 普通建筑
            buildModel = this.createBuildingModelByCfg(i, s, roomId, o, a, n, r, d);
        }

        // 设置可操作属性
        buildModel.canHandle = canHandle_;

        // 添加建筑到地图 & 玩家
        this.addBuilding(buildModel, playModel);

        // 如果是进攻方，则格子不可通行
        if (XMgr.playerMgr.player.type != XPlayerType.E_Defender) {
            XMgr.mapMgr.setDynWalkable(a, n, false);
        }

        // 派发建造事件
        EventCenter.emit(XEventNames.E_BUILDING_BUILD, buildModel, false, 60);
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
        let selectedTowers: { tower: any, weight: number }[] = [];
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

    getOutdoorEmptyGrids(x_, y_, delta_ = 1) {
        let ret = [];
        for (let n = -delta_; n <= delta_; n++)
            for (let r = -delta_; r <= delta_; r++) {
                let x = x_ + n,
                    y = y_ + r,
                    tileInfo = XMgr.mapMgr.getTiledInfo(x, y);
                tileInfo.walkable && void 0 === tileInfo.roomId && ret.push(new Vec2(x, y))
            }
        return ret
    }
}