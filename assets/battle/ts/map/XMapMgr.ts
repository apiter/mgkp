import { XConst } from "../xconfig/XConst"
import { XGrid } from "./XGrid"

export class MapMgr {
    _outRoomGirds = []
    outRoomGridsInsideMap = []
    hideDoors = []
    roomBuildings = []
    outBuildings = []
    hideWall = []
    hideWallMap = new Map
    roomsWall = []
    _height = 0
    _width = 0
    _grid: XGrid = null
    _mapBoundBox = null

    constructor() {
    }

    init(e, t) {
        this.outBuildings = [], this.parseData(e, t), this._grid = new XGrid(this._height, this._width);
        for (let e = 0; e < this._height; e++)
            for (let t = 0; t < this._width; t++) this.setWalkable(e, t, this.isWalkable(e, t)), this.setDynWalkable(e, t, this.isWalkable(e, t));
        this.initRooms(), this.initOutRoomGrids(), this._mapBoundBox = {
            minX: 0,
            maxX: this._width * XConst.GridSize,
            minY: 0,
            maxY: this._height * XConst.GridSize
        };
        for (const e of this._hideRooms) this.setWalkable(e.doorPos.x, e.doorPos.y, !1), this.setDynWalkable(e.doorPos.x, e.doorPos.y, !1);
        for (const e of this._invalidHideRooms) this.setWalkable(e.doorPos.x, e.doorPos.y, !1), this.setDynWalkable(e.doorPos.x, e.doorPos.y, !1)
    }
    get width() {
        return this._width
    }
    get height() {
        return this._height
    }
    get buildings() {
        return this._buildings
    }
    get views() {
        return this._viewList
    }
    get rooms() {
        return this._rooms
    }
    get hideRooms() {
        return this._hideRooms
    }
    get mapNode() {
        return this._mapNode
    }
    set mapNode(e) {
        this._mapNode = e
    }
    get mapBoundBox() {
        return this._mapBoundBox
    }
    get hunterSpawns() {
        return this._hunterSpawns
    }
    get mapBuildPoints() {
        return this._mapBuildPoints
    }
    get mapEquipPoints() {
        return this._mapEquipPoints
    }
    get healZones() {
        return this._healZones
    }
    get realWidth() {
        return this.width * C.GridSize
    }
    get realHeight() {
        return this.height * XConst.GridSize
    }
    get outRoomGrids() {
        return this._outRoomGirds.slice()
    }
    parseData(e, t) {
        this._tiledMap = [], this._rooms = [], this._hideRooms = [], this._invalidHideRooms = [], this._buildings = [], this._hunterSpawns = [], this._defenderSpawns = [], this._mapBuildPoints = [], this._mapEquipPoints = [], this._healZones = [], this._viewList = [], this._width = e.width, this._height = e.height, this._tileSets = this.getTilesets(e), this.hideDoors = [], this.hideWall = [], this.hideWallMap.clear();
        let i = -1,
            s = this.getLayer(e, "data").objects;
        for (const e of s)
            if ("HealZone" == e.type) {
                let t = new Laya.Rectangle(e.x, e.y, e.width, e.height);
                this._healZones.push(t)
            } else if ("DefenderSpawnPoint" == e.type) this._defenderSpawns.push(new fx.V2(e.x, e.y));
            else if ("HunterSpawnPoint" == e.type) this._hunterSpawns.push(new fx.V2(e.x, e.y));
            else if ("MapBuildPoint" == e.type) this._mapBuildPoints.push(new fx.V2(e.x, e.y));
            else if ("MapEquipPoint" == e.type) {
                let t = e.name.split("-");
                t[1] && ("1" == t[1] ? (this._mapEquipPoints[0] || (this._mapEquipPoints[0] = []), this._mapEquipPoints[0].push(new fx.V2(e.x, e.y))) : "2" == t[1] ? (this._mapEquipPoints[1] || (this._mapEquipPoints[1] = []), this._mapEquipPoints[1].push(new fx.V2(e.x, e.y))) : "3" == t[1] ? (this._mapEquipPoints[2] || (this._mapEquipPoints[2] = []), this._mapEquipPoints[2].push(new fx.V2(e.x, e.y))) : "4" == t[1] && (this._mapEquipPoints[3] || (this._mapEquipPoints[3] = []), this._mapEquipPoints[3].push(new fx.V2(e.x, e.y))))
            } else if (-1 != e.name.indexOf("Room")) {
                let s = e.name.replace("Room_", ""),
                    a = Number(s);
                if (this.getRoomById(a)) {
                    console.error(`Room重复 ${a}`);
                    continue
                }
                let n = new Za;
                n.id = a;
                let r = this.mapPosToGridPos(e.x, e.y);
                if (n.x = r.x, n.y = r.y, "Hide" == e.type) {
                    ++i == t ? (n.active = !1, this._hideRooms.push(n), this._rooms.push(n), console.log(`------------------隐藏房间： ${e.name}`)) : this._invalidHideRooms.push(n);
                    continue
                }
                this._rooms.push(n)
            }
        let a = this.getLayer(e, "ground").data,
            n = this.getLayer(e, "build").data,
            r = this.getLayer(e, "view") ? this.getLayer(e, "view").data : null;
        for (let e = 0; e < this._height; ++e) {
            this._tiledMap[e] = [];
            for (let t = 0; t < this._width; ++t) {
                let i = new Ja(e, t),
                    s = e * this._width + t,
                    o = a[s];
                0 == o ? (i.groundBlock = "floor_1", i.groundRot = 0) : (i.groundBlock = this._tileSets[o][0], i.groundRot = this._tileSets[o][1]), -1 !== i.groundBlock.indexOf("wall_break") && this.hideWall.push(new fx.V2(i.x, i.y)), -1 != i.groundBlock.indexOf("floor_1") && this.outRoomGridsInsideMap.push(new fx.V2(e, t)), -1 != i.groundBlock.indexOf("wall_unable") && this.hideDoors.push(new fx.V2(i.x, i.y)), -1 != i.groundBlock.indexOf("floor") && (i.walkable = !0);
                let l = n[s];
                if (l > 0) {
                    let e = this._tileSets[l][0],
                        t = e.split("_");
                    i.buildName = e, i.buildId = Number(t[1]), i.buildRot = this._tileSets[l][1], i.lv = t[3] ? Number(t[3]) : 1, this._buildings.push(i)
                }
                if (this._tiledMap[e][t] = i, r) {
                    let i = r[s];
                    if (i > 0) {
                        let s = new Ja(e, t);
                        if (!this._tileSets[i]) continue;
                        let a = this._tileSets[i][2].name;
                        s.image = `res/map/${a}.png`, s.groundBlock = a, this._viewList.push(s)
                    }
                }
            }
        }
    }
    getTilesets(e) {
        let t = {};
        for (let i = 0; i < e.tilesets.length; ++i) {
            let s, a, n = e.tilesets[i],
                r = n.name.split("_"),
                o = Number(r[r.length - 1]);
            !isNaN(o) && o >= 90 ? (s = n.name.replace(`_${o}`, ""), a = o) : (s = n.name, a = 0), t[n.firstgid] = [s, a, n]
        }
        return t
    }
    getLayer(e, t) {
        for (const i of e.layers)
            if (i.name == t) return i
    }
    initRooms() {
        for (const e of this._rooms) {
            let t = [],
                i = [],
                s = [];
            this.searchRoomGrids(e.id, e.x, e.y, t, i, s), e.walls = i;
            let a, n = new fx.V2(e.x, e.y),
                r = 1 / 0;
            for (const e of s) {
                let t = n.distanceSq(e);
                if (t < r) r = t, a = e;
                else if (t == r)
                    if (e.x == a.x)
                        if (e.y < a.y) {
                            let t = this.getTiledInfo(e.x, e.y - 1);
                            t.roomId ? a = e : t.groundBlock && -1 != t.groundBlock.indexOf("floor_1") && (a = e)
                        } else {
                            let t = this.getTiledInfo(e.x, e.y + 1);
                            t.roomId ? a = e : t.groundBlock && -1 != t.groundBlock.indexOf("floor_1") && (a = e)
                        } else if (e.y == a.y)
                        if (e.x < a.x) {
                            let t = this.getTiledInfo(e.x - 1, e.y);
                            t.roomId ? a = e : t.groundBlock && -1 != t.groundBlock.indexOf("floor_1") && (a = e)
                        } else {
                            let t = this.getTiledInfo(e.x + 1, e.y);
                            t.roomId ? a = e : t.groundBlock && -1 != t.groundBlock.indexOf("floor_1") && (a = e)
                        }
            }
            let o = [];
            for (const e of s) e.x == a.x && e.y == a.y || o.push(e);
            e.doorPosArr = o, e.doorPos = a, e.doorRot = this._tiledMap[a.x][a.y].buildRot, t.unshift(a), e.grids = t
        }
        for (const e of this.rooms) {
            let t = e.grids[0],
                i = this.getTiledInfo(t.x, t.y);
            if (!i) return;
            i && (i.roomId = e.id)
        }
        for (const e of this._invalidHideRooms) {
            let t = [],
                i = [],
                s = [];
            this.searchRoomGrids(e.id, e.x, e.y, t, i, s), e.walls = i;
            let a, n = new fx.V2(e.x, e.y),
                r = 1 / 0;
            for (const e of s) {
                let t = n.distanceSq(e);
                if (t < r) r = t, a = e;
                else if (t == r)
                    if (e.x == a.x)
                        if (e.y < a.y) {
                            let t = this.getTiledInfo(e.x, e.y - 1);
                            t.roomId ? a = e : t.groundBlock && -1 != t.groundBlock.indexOf("floor_1") && (a = e)
                        } else {
                            let t = this.getTiledInfo(e.x, e.y + 1);
                            t.roomId ? a = e : t.groundBlock && -1 != t.groundBlock.indexOf("floor_1") && (a = e)
                        } else if (e.y == a.y)
                        if (e.x < a.x) {
                            let t = this.getTiledInfo(e.x - 1, e.y);
                            t.roomId ? a = e : t.groundBlock && -1 != t.groundBlock.indexOf("floor_1") && (a = e)
                        } else {
                            let t = this.getTiledInfo(e.x + 1, e.y);
                            t.roomId ? a = e : t.groundBlock && -1 != t.groundBlock.indexOf("floor_1") && (a = e)
                        }
            }
            e.doorPos = a, t.unshift(a), e.grids = t
        }
    }
    searchRoomGrids(e, t, i, s, a, n, r = !1) {
        let o = new fx.V2(t, i);
        if (XV2Util01.isV2InArray(o, s) || XV2Util01.isV2InArray(o, a)) return;
        let l = this.getTiledInfo(t, i);
        if (l)
            if (l && (l.roomId = e), l.walkable) {
                if (r) return;
                if (l.groundBlock && -1 != l.groundBlock.indexOf("floor_1")) return;
                if (l.buildName && -1 != l.buildName.indexOf("door")) return void n.push(o);
                s.push(o), this.searchRoomGrids(e, t, i + 1, s, a, n), this.searchRoomGrids(e, t, i - 1, s, a, n), this.searchRoomGrids(e, t + 1, i, s, a, n), this.searchRoomGrids(e, t - 1, i, s, a, n), this.searchRoomGrids(e, t + 1, i + 1, s, a, n, !0), this.searchRoomGrids(e, t + 1, i - 1, s, a, n, !0), this.searchRoomGrids(e, t - 1, i + 1, s, a, n, !0), this.searchRoomGrids(e, t - 1, i - 1, s, a, n, !0)
            } else a.push(o)
    }
    initOutRoomGrids() {
        this._outRoomGirds = [];
        for (let e = 0; e < this._height; ++e)
            for (let t = 0; t < this._width; ++t) {
                let i = this._tiledMap[e][t];
                i && !i.roomId && i.walkable && this._outRoomGirds.push(i)
            }
    }
    getRoomById(e) {
        for (const t of this._rooms)
            if (t.id == e) return t
    }
    getRoomByGridPos(e, t) {
        let i = this.getRoomIdByGridPos(e, t);
        if (-1 !== i) return this.getRoomById(i)
    }
    getRoomByWallGrid(e, t) {
        let i = null;
        if (this.roomsWall[`x${e}_y${t}`]) return i = this.getRoomById(this.roomsWall[`x${e}_y${t}`])
    }
    getRoomTiledList(e) {
        let t = [];
        for (const i of e.grids) {
            let e = this.getTiledInfo(i.x, i.y);
            e && t.push(e)
        }
        return t
    }
    getTiledInfo(e, t) {
        return this._tiledMap[e] ? this._tiledMap[e][t] : null
    }
    isWall(e, t, i) {
        if (!i) return;
        let s = i.walls;
        for (const i of s)
            if (e == i.x && t == i.y) return !0;
        return !1
    }
    isGridWall(e, t) {
        let i = this.getTiledInfo(e, t);
        if (i) return -1 != i.groundBlock.indexOf("wall")
    }
    getHunterSpawnPos(e) {
        return e = Math.clamp(e, 0, this._hunterSpawns.length - 1), this._hunterSpawns[e]
    }
    getDefenderSpawnPos(e) {
        return e = Math.clamp(e, 0, this._defenderSpawns.length - 1), this._defenderSpawns[e % this._defenderSpawns.length]
    }
    mapPosToGridPos(e, t) {
        let i = Math.floor(t / C.GridSize);
        var s = Math.floor(e / C.GridSize);
        return new fx.V2(i, s)
    }
    gridPosToMapPos(e, t) {
        let i = t * C.GridSize + C.GridHalfSize,
            s = e * C.GridSize + C.GridHalfSize;
        return new fx.V2(i, s)
    }
    mapPosToStagePos(e, t) {
        return {
            x: e + this._mapNode.x,
            y: t + this._mapNode.y
        }
    }
    stagePosToMapPos(e, t) {
        return {
            x: e - this._mapNode.x,
            y: t - this._mapNode.y
        }
    }
    isInStageByGridPos(e, t) {
        let i = this.gridPosToMapPos(e, t);
        return this.isInStageByMapPos(i.x, i.y)
    }
    isInStageByMapPos(e, t) {
        let i = this.mapPosToStagePos(e, t);
        return !(i.x < 0 || i.x > Laya.stage.width || i.y < 0 || i.y > Laya.stage.height)
    }
    isWalkable(e, t) {
        return !(!this._tiledMap[e] || !this._tiledMap[e][t]) && this._tiledMap[e][t].walkable
    }
    twoGridsInSameRoome(e, t, i, s) {
        return this.getRoomByGridPos(e, t) == this.getRoomByGridPos(i, s)
    }
    getRoomIdByMapPos(e, t) {
        let i = this.mapPosToGridPos(e, t);
        return this.getRoomIdByGridPos(i.x, i.y)
    }
    getRoomIdByGridPos(e, t) {
        let i = this.getTiledInfo(e, t);
        if (i && i.roomId && i.buildName && i.buildName.includes("door")) return i.roomId;
        for (const i of this.rooms)
            for (const s of i.grids)
                if (s.x == e && s.y == t) return i.id;
        return -1
    }
    getRoomIdByGrid(e, t) {
        let i = this.getTiledInfo(e, t);
        if (i && i.roomId && i.buildName && i.buildName.includes("door")) return i.roomId;
        for (const i of this.rooms)
            for (const s of i.grids)
                if (s.x == e && s.y == t) return i.id;
        for (const i of this.rooms)
            for (const s of i.walls)
                if (s.x == e && s.y == t) return i.id;
        return -1
    }
    getRandomPosByRoomId(e) {
        for (const t of this.rooms)
            if (e == t.id) {
                let e = fx.Utils.cloneArray(t.grids);
                for (const i of t.buildings)
                    for (let t = 0; t < e.length; t++) i.x != e[t].x || i.y != e[t].y || e.splice(t, 1);
                return fx.Utils.randomInArray(e)
            }
    }
    getRoomsByDistance(e) {
        let t = this.rooms.slice();
        for (let i = 0; i < t.length - 1; ++i) {
            let s = !1;
            for (let a = t.length - 1; a > i; --a) {
                let i = this.gridPosToMapPos(t[a].x, t[a].y),
                    n = XV2Util01.pDistance(e, i),
                    r = this.gridPosToMapPos(t[a - 1].x, t[a - 1].y);
                if (XV2Util01.pDistance(e, r) > n) {
                    let e = t[a - 1];
                    t[a - 1] = t[a], t[a] = e, s = !0
                }
            }
            if (!s) break
        }
        return t
    }
    findPath(e, t, i, s, a = !1) {
        let n = this.mapPosToGridPos(e, t),
            r = this.mapPosToGridPos(i, s);
        if (this._grid.setStartNode(n.x, n.y), !this._grid.setEndNode(r.x, r.y)) return [];
        let o = new XAStar;
        if (o.findPath(this._grid, a), !o.path) return [];
        let l = [];
        for (let e = 0; e < o.path.length; ++e) {
            let t = this.gridPosToMapPos(o.path[e].x, o.path[e].y);
            l.push(t)
        }
        return l
    }
    limitMove(e, t, i, s, a = 0) {
        if (0 == i && 0 == s) return {
            x: e,
            y: t
        };
        let n = e + (i = Math.min(i, C.GridHalfSize - .01)),
            r = t + (s = Math.min(s, C.GridHalfSize - .01)),
            o = e + i,
            l = t + s,
            h = this.mapPosToGridPos(e, t);
        i > 0 ? o += a : i < 0 && (o -= a), s > 0 ? l += a : s < 0 && (l -= a);
        let d = this.mapPosToGridPos(o, l);
        if (XV2Util01.isV2Equal(h, d)) return {
            x: n,
            y: r
        };
        let u = !1;
        if (h.y != d.y) {
            let e = d.y > h.y ? 1 : -1,
                t = this._grid.getNode(h.x, h.y + e);
            t && !t.dynWalkable && (o = this.gridPosToMapPos(h.x, h.y + e).x - e * (C.GridHalfSize + .01) - e * a, u = !0)
        }
        if (u || (o = n), u = !1, h.x != d.x) {
            let e = d.x > h.x ? 1 : -1,
                t = this._grid.getNode(h.x + e, h.y);
            t && !t.dynWalkable && (l = this.gridPosToMapPos(h.x + e, h.y).y - e * (C.GridHalfSize + .01) - e * a, u = !0)
        }
        u || (l = r);
        let g = this.mapPosToGridPos(o, l),
            c = this._grid.getNode(g.x, g.y);
        return c && !c.dynWalkable && (o = e, l = t), {
            x: o,
            y: l
        }
    }
    move(e, t, i, s, a = 0) {
        if (0 == i && 0 == s) return {
            x: e,
            y: t
        };
        let n = e + (i = Math.min(i, C.GridHalfSize - .01)),
            r = t + (s = Math.min(s, C.GridHalfSize - .01)),
            o = e + i,
            l = t + s,
            h = this.mapPosToGridPos(e, t);
        i > 0 ? o += a : i < 0 && (o -= a), s > 0 ? l += a : s < 0 && (l -= a);
        let d = this.mapPosToGridPos(o, l);
        return XV2Util01.isV2Equal(h, d), {
            x: n,
            y: r
        }
    }
    setWalkable(e, t, i) {
        this._grid.setWalkable(e, t, i)
    }
    setDynWalkable(e, t, i) {
        this._grid.setDynWalkable(e, t, i)
    }
    isInMap(e, t) {
        return !(e < this.mapBoundBox.minX || e > this.mapBoundBox.maxX || t < this.mapBoundBox.minY || t > this.mapBoundBox.maxY)
    }
    isInHealZone(e, t) {
        for (const i of this._healZones)
            if (i.contains(e, t)) return !0;
        return !1
    }
    stagePosToGridPos(e, t) {
        let i = this.stagePosToMapPos(e, t);
        return i = this.mapPosToGridPos(i.x, i.y)
    }
    isHideRoomDoor(e, t) {
        for (const i of this.hideRooms)
            if (i.doorPos.x == e && i.doorPos.y == t) return !i.active;
        return !1
    }
    getHideDoorPosByRoomId(e) {
        let t = [];
        for (const e of this.hideDoors) {
            let i = this.getRoomIdByGrid(e.x, e.y);
            i && -1 !== i && t.push(e)
        }
        if (t.length > 0) return t
    }
    getActiveRoomCnt() {
        let e = 0;
        for (const t of this.rooms) t.active && e++;
        return e
    }
    getRandomRoom(e) {
        let t = [];
        for (const i of this.rooms) 0 != i.active && i != e && t.push(i);
        return fx.Utils.randomInArray(t)
    }
    getMapTiles() {
        return this._tiledMap
    }
}