import { log, math, Rect, v2, Vec2, view } from "cc"
import { XConst } from "../xconfig/XConst"
import { XGrid } from "./XGrid"
import { XRoomModel } from "../model/XRoomModel"
import { XV2Util01 } from "../xutil/XV2Util01"
import { XRandomUtil } from "../xutil/XRandomUtil"
import XAStar from "./XAStar"
import XUtil from "../xutil/XUtil"
import { XCfgMapData } from "../xconfig/XCfgData"

class XTiledInfo {
    x: number = 0
    y: number = 0
    groundBlock: string = ""
    groundRot: number = 0
    buildName: string = ""
    buildId: number = 0
    buildRot: number = 0
    lv: number = 1
    walkable: boolean = false
    roomId: number = 0
    image: string

    constructor(x_, y_) {
        this.x = x_, this.y = y_
    }
}

export class XMapMgr {
    roomsWall = []
    _height = 0
    _width = 0
    _grid: XGrid = null
    // _mapBoundBox = null

    _tiledMap: XTiledInfo[][] = []
    _rooms: XRoomModel[] = []
    _buildings:XTiledInfo[] = []
    _hunterSpawns = []
    _defenderSpawns: Vec2[] = []
    _mapBuildPoints = []
    _mapEquipPoints = []
    _healZones = []
    _viewList = []
    _tileSets = null
    _mapNode = null

    init(mapData_: XCfgMapData) {
        this.parseData(mapData_)
        this._grid = new XGrid(this._height, this._width);
        for (let h = 0; h < this._height; h++)
            for (let w = 0; w < this._width; w++) {
                this.setWalkable(h, w, this.isWalkable(h, w))
                this.setDynWalkable(h, w, this.isWalkable(h, w));
            }
        this.initRooms()
        // this._mapBoundBox = {
        //     minX: 0,
        //     maxX: this._width * XConst.GridSize,
        //     minY: 0,
        //     maxY: this._height * XConst.GridSize
        // };
    }
    parseData(mapData_: XCfgMapData) {
        this._width = mapData_.width
        this._height = mapData_.height
        this._tileSets = this.getTilesets(mapData_)
        const objs = this.getLayer(mapData_, "data").objects;
        for (const obj of objs) {
            if ("HealZone" == obj.type) {
                let t = new Rect(obj.x, obj.y, obj.width, obj.height);
                this._healZones.push(t)
            }
            else if ("DefenderSpawnPoint" == obj.type)
                this._defenderSpawns.push(new Vec2(obj.x, -obj.y));
            else if ("HunterSpawnPoint" == obj.type)
                this._hunterSpawns.push(new Vec2(obj.x, -obj.y));
            else if ("MapBuildPoint" == obj.type)
                this._mapBuildPoints.push(new Vec2(obj.x, -obj.y));
            else if ("MapEquipPoint" == obj.type) {
                let t = obj.name.split("-");
                if (t[1]) {
                    const index = parseInt(t[1], 10) - 1;
                    if (index >= 0 && index <= 3) {
                        (this._mapEquipPoints[index] ??= []).push(new Vec2(obj.x, -obj.y));
                    }
                }
            } else if (-1 != obj.name.indexOf("Room")) {
                let s = obj.name.replace("Room_", ""),
                    roomId = Number(s);
                if (this.getRoomById(roomId)) {
                    console.error(`Room重复 ${roomId}`);
                    continue
                }
                let roomModel = new XRoomModel;
                roomModel.id = roomId;
                let r = this.mapPosToGridPos(obj.x, obj.y);
                roomModel.x = r.x
                roomModel.y = r.y
                this._rooms.push(roomModel)
            }
        }
        let groundDataArr = this.getLayer(mapData_, "ground").data
        const buildDataArr = this.getLayer(mapData_, "build").data
        for (let h = 0; h < this._height; ++h) {
            this._tiledMap[h] = [];
            for (let w = 0; w < this._width; ++w) {
                let tiledInfo = new XTiledInfo(h, w)
                const tiledIdx = h * this._width + w
                const groundData = groundDataArr[tiledIdx];
                if (groundData == 0) {
                    tiledInfo.groundBlock = "floor_1";
                    tiledInfo.groundRot = 0;
                } else {
                    tiledInfo.groundBlock = this._tileSets[groundData][0];
                    tiledInfo.groundRot = this._tileSets[groundData][1];
                }

                if (tiledInfo.groundBlock.indexOf("floor") !== -1) {
                    tiledInfo.walkable = true;
                }
                let buildIdx = buildDataArr[tiledIdx];
                if (buildIdx > 0) {
                    let name = this._tileSets[buildIdx][0]
                    const buildId = name.split("_");
                    tiledInfo.buildName = name
                    tiledInfo.buildId = Number(buildId[1])
                    tiledInfo.buildRot = this._tileSets[buildIdx][1]
                    tiledInfo.lv = buildId[3] ? Number(buildId[3]) : 1
                    this._buildings.push(tiledInfo)
                }
                this._tiledMap[h][w] = tiledInfo
                // log("ground block:", tiledInfo.groundBlock)
            }
        }
    }
    getTilesets(cfg_) {
        let rets = {};
    
        for (let i = 0; i < cfg_.tilesets.length; ++i) {
            let setInfo = cfg_.tilesets[i];
            let splitArr = setInfo.name.split("_");
    
            let lastNumber = Number(splitArr[splitArr.length - 1]);
            let name, rot;
    
            if (!isNaN(lastNumber) && lastNumber >= 90) {
                name = setInfo.name.replace(`_${lastNumber}`, "");
                rot = lastNumber;
            } else {
                name = setInfo.name;
                rot = 0;
            }
    
            rets[setInfo.firstgid] = [name, rot, setInfo];
        }
    
        return rets;
    }
    
    getLayer(cfg_, key_) {
        for (const i of cfg_.layers)
            if (i.name == key_) return i
    }
    initRooms() {
        for (const room of this._rooms) {
            let roomTiles: Vec2[] = []
            let blockTiles: Vec2[] = []
            let doorTiles: Vec2[] = []
            this.searchRoomGrids(room.id, room.x, room.y, roomTiles, blockTiles, doorTiles)
            room.walls = blockTiles;
            let currentTile, roomTile = new Vec2(room.x, room.y)
            let minDis = 1 / 0;
            for (const tile of doorTiles) {
                let doorRoomDis = Vec2.squaredDistance(roomTile, tile)
                if (doorRoomDis < minDis) minDis = doorRoomDis, currentTile = tile;
                else if (doorRoomDis == minDis)
                    if (tile.x == currentTile.x)
                        if (tile.y < currentTile.y) {
                            let t = this.getTiledInfo(tile.x, tile.y - 1);
                            t.roomId ? currentTile = tile : t.groundBlock && -1 != t.groundBlock.indexOf("floor_1") && (currentTile = tile)
                        } else {
                            let t = this.getTiledInfo(tile.x, tile.y + 1);
                            t.roomId ? currentTile = tile : t.groundBlock && -1 != t.groundBlock.indexOf("floor_1") && (currentTile = tile)
                        } else if (tile.y == currentTile.y)
                        if (tile.x < currentTile.x) {
                            let t = this.getTiledInfo(tile.x - 1, tile.y);
                            t.roomId ? currentTile = tile : t.groundBlock && -1 != t.groundBlock.indexOf("floor_1") && (currentTile = tile)
                        } else {
                            let t = this.getTiledInfo(tile.x + 1, tile.y);
                            t.roomId ? currentTile = tile : t.groundBlock && -1 != t.groundBlock.indexOf("floor_1") && (currentTile = tile)
                        }
            }
            let doorTileArr: Vec2[] = [];
            for (const doorTile of doorTiles) doorTile.x == currentTile.x && doorTile.y == currentTile.y || doorTileArr.push(doorTile);
            room.doorPosArr = doorTileArr
            room.doorPos = currentTile
            room.doorRot = this._tiledMap[currentTile.x][currentTile.y].buildRot
            roomTiles.unshift(currentTile)
            room.grids = roomTiles
        }
        for (const room of this.rooms) {
            let t = room.grids[0],
                i = this.getTiledInfo(t.x, t.y);
            if (!i) return;
            i && (i.roomId = room.id)
        }
    }

    searchRoomGrids(id_, x_, y_, roomTiles_: Vec2[], blockTiles_: Vec2[], doorTiles_: Vec2[], slant_ = false) {
        let tileXy = new Vec2(x_, y_);

        if (XV2Util01.isV2InArray(tileXy, roomTiles_) || XV2Util01.isV2InArray(tileXy, blockTiles_)) return;

        let tileInfo = this.getTiledInfo(x_, y_);

        if (tileInfo) {
            tileInfo.roomId = id_
            if (tileInfo.walkable) {
                if (slant_) return; // 如果是对角线搜索（r = true），直接退出

                // 如果是地板1，不再继续
                if (tileInfo.groundBlock && -1 != tileInfo.groundBlock.indexOf("floor_1")) return;

                // 如果是门，加入 n 数组后直接返回
                if (tileInfo.buildName && -1 != tileInfo.buildName.indexOf("door"))
                    return void doorTiles_.push(tileXy);

                roomTiles_.push(tileXy);

                // 向四个方向递归搜索
                this.searchRoomGrids(id_, x_, y_ + 1, roomTiles_, blockTiles_, doorTiles_);
                this.searchRoomGrids(id_, x_, y_ - 1, roomTiles_, blockTiles_, doorTiles_);
                this.searchRoomGrids(id_, x_ + 1, y_, roomTiles_, blockTiles_, doorTiles_);
                this.searchRoomGrids(id_, x_ - 1, y_, roomTiles_, blockTiles_, doorTiles_);

                // 向四个斜角递归搜索
                this.searchRoomGrids(id_, x_ + 1, y_ + 1, roomTiles_, blockTiles_, doorTiles_, !0);
                this.searchRoomGrids(id_, x_ + 1, y_ - 1, roomTiles_, blockTiles_, doorTiles_, !0);
                this.searchRoomGrids(id_, x_ - 1, y_ + 1, roomTiles_, blockTiles_, doorTiles_, !0);
                this.searchRoomGrids(id_, x_ - 1, y_ - 1, roomTiles_, blockTiles_, doorTiles_, !0);

            } else blockTiles_.push(tileXy) // 如果 tileInfo 不可走，则加入 （障碍物集合）
        }

    }

    getRoomById(roomId_) {
        for (const r of this._rooms)
            if (r.id == roomId_) return r
    }
    getRoomByGridPos(x_, y_) {
        let i = this.getRoomIdByGridPos(x_, y_);
        if (-1 !== i) return this.getRoomById(i)
    }

    getRoomByWallGrid(x_, y_) {
        if (this.roomsWall[`x${x_}_y${y_}`])
            return this.getRoomById(this.roomsWall[`x${x_}_y${y_}`])
    }

    getRoomTiledList(room_: XRoomModel) {
        let tiles: XTiledInfo[] = [];
        for (const grid of room_.grids) {
            let tile = this.getTiledInfo(grid.x, grid.y);
            tile && tiles.push(tile)
        }
        return tiles
    }
    getTiledInfo(x_, y_) {
        return this._tiledMap[x_] ? this._tiledMap[x_][y_] : null
    }

    isWall(x_, y_, i) {
        if (!i) return;
        let s = i.walls;
        for (const i of s)
            if (x_ == i.x && y_ == i.y) return !0;
        return !1
    }

    isGridWall(x_, y_) {
        let i = this.getTiledInfo(x_, y_);
        if (i) return -1 != i.groundBlock.indexOf("wall")
    }

    getHunterSpawnPos(idx_) {
        return idx_ = math.clamp(idx_, 0, this._hunterSpawns.length - 1), this._hunterSpawns[idx_]
    }

    getDefenderSpawnPos(idx_) {
        idx_ = math.clamp(idx_, 0, this._defenderSpawns.length - 1)
        return this._defenderSpawns[idx_ % this._defenderSpawns.length]
    }
    mapPosToGridPos(mapX_, mapY_) {
        let h = Math.floor(Math.abs(mapY_) / XConst.GridSize);
        var w = Math.floor(mapX_ / XConst.GridSize);
        return new Vec2(h, w)
    }
    gridPosToMapPos(col_, row_) {
        let x = row_ * XConst.GridSize + XConst.GridHalfSize,
            y = -(col_ * XConst.GridSize + XConst.GridHalfSize);
        return new Vec2(x, y)
    }
    mapPosToStagePos(mapX_, mapY_) {
        return {
            x: mapX_ + this._mapNode.x,
            y: mapY_ + this._mapNode.y
        }
    }
    stagePosToMapPos(x_, y_) {
        return {
            x: x_ - this._mapNode.x,
            y: y_ - this._mapNode.y
        }
    }
    isInStageByGridPos(col_, row_) {
        let mapPos = this.gridPosToMapPos(col_, row_);
        return this.isInStageByMapPos(mapPos.x, mapPos.y)
    }
    isInStageByMapPos(mapX_, mapY_) {
        let stagePos = this.mapPosToStagePos(mapX_, mapY_);
        return !(stagePos.x < 0 || stagePos.x > view.getVisibleSize().x || stagePos.y < 0 || stagePos.y > view.getVisibleSize().y)
    }
    isWalkable(x_, y_) {
        return !(!this._tiledMap[x_] || !this._tiledMap[x_][y_]) && this._tiledMap[x_][y_].walkable
    }
    twoGridsInSameRoome(x1_, y1_, x2_, y2_) {
        return this.getRoomByGridPos(x1_, y1_) == this.getRoomByGridPos(x2_, y2_)
    }
    getRoomIdByMapPos(mapX_, mapY) {
        let gridPos = this.mapPosToGridPos(mapX_, mapY);
        return this.getRoomIdByGridPos(gridPos.x, gridPos.y)
    }
    getRoomIdByGridPos(x_, y_) {
        let tileInfo = this.getTiledInfo(x_, y_);
        if (tileInfo && tileInfo.roomId && tileInfo.buildName && tileInfo.buildName.includes("door")) return tileInfo.roomId;
        for (const room of this.rooms)
            for (const s of room.grids)
                if (s.x == x_ && s.y == y_) return room.id;
        return -1
    }
    getRoomIdByGrid(x_, y_) {
        let i = this.getTiledInfo(x_, y_);
        if (i && i.roomId && i.buildName && i.buildName.includes("door")) return i.roomId;
        for (const i of this.rooms)
            for (const s of i.grids)
                if (s.x == x_ && s.y == y_) return i.id;
        for (const i of this.rooms)
            for (const s of i.walls)
                if (s.x == x_ && s.y == y_) return i.id;
        return -1
    }
    getRandomPosByRoomId(roomId_: number) {
        for (const t of this.rooms) {
            if (roomId_ == t.id) {
                let roomGrids = XUtil.deepClone(t.grids);
        
                // 移除被建筑占用的格子
                for (const build of t.buildings) {
                    for (let i = 0; i < roomGrids.length; i++) {
                        if (build.x == roomGrids[i].x && build.y == roomGrids[i].y) {
                            roomGrids.splice(i, 1);
                        }
                    }
                }
        
                return XRandomUtil.randomInArray(roomGrids);
            }
        }
    }

    findPath(mapX1_, mapY1_, mapX2_, mapY2_, slant_ = false) {
        const gridPos1 = this.mapPosToGridPos(mapX1_, mapY1_)
        const gridPos2 = this.mapPosToGridPos(mapX2_, mapY2_)
        this._grid.setStartNode(gridPos1.x, gridPos1.y)
        if (!this._grid.setEndNode(gridPos2.x, gridPos2.y)) return [];
        let path = new XAStar;
        path.findPath(this._grid, slant_)
        if (!path.path)
            return [];
        let l = [];
        for (let e = 0; e < path.path.length; ++e) {
            let t = this.gridPosToMapPos(path.path[e].x, path.path[e].y);
            l.push(t)
        }
        return l
    }
    limitMove(oldX_, oldY_, deltaX_, deltaY, a = 0): { x: number, y: number } {
        if (0 == deltaX_ && 0 == deltaY)
            return {
                x: oldX_,
                y: oldY_
            };
        let newXClamp = oldX_ + (deltaX_ = Math.min(deltaX_, XConst.GridHalfSize - .01))
        let newYClamp = oldY_ + (deltaY = Math.min(deltaY, XConst.GridHalfSize - .01))
        let newX = oldX_ + deltaX_
        let newY = oldY_ + deltaY
        let oldGrid = this.mapPosToGridPos(oldX_, oldY_);
        deltaX_ > 0 ? newX += a : deltaX_ < 0 && (newX -= a)
        deltaY > 0 ? newY += a : deltaY < 0 && (newY -= a);
        let newGrid = this.mapPosToGridPos(newX, newY);
        if (XV2Util01.isV2Equal(oldGrid, newGrid))
            return { x: newXClamp, y: newYClamp };
        // console.log(`原格子(${oldGrid.toString()} 新格子:(${newGrid.toString()}))`)
        let adjust = false;
        if (oldGrid.y != newGrid.y) {//水平
            let deltaGridY = newGrid.y > oldGrid.y ? 1 : -1//1=向右 -1=向左
            let nextGridX = this._grid.getNode(oldGrid.x, oldGrid.y + deltaGridY);
            if (nextGridX && !nextGridX.dynWalkable) {
                newX = this.gridPosToMapPos(oldGrid.x, oldGrid.y + deltaGridY).x - deltaGridY * (XConst.GridHalfSize + .01) - deltaGridY * a
                adjust = true
            }
        }
        adjust || (newX = newXClamp)
        adjust = false
        if (oldGrid.x != newGrid.x) {
            let deltaGridX = newGrid.x > oldGrid.x ? 1 : -1
            let nextGridY = this._grid.getNode(oldGrid.x + deltaGridX, oldGrid.y)
            if (nextGridY && !nextGridY.dynWalkable) {
                newY = this.gridPosToMapPos(oldGrid.x + deltaGridX, oldGrid.y).y + deltaGridX * (XConst.GridHalfSize + .01) + deltaGridX * a
                adjust = true
            }
        }
        adjust || (newY = newYClamp);
        let pos = this.mapPosToGridPos(newX, newY)
        let gridCell = this._grid.getNode(pos.x, pos.y);
        gridCell && !gridCell.dynWalkable && (newX = oldX_, newY = oldY_)
        return {
            x: newX,
            y: newY
        }
    }
    move(oldX_, oldY_, deltaX_, deltaY_, a = 0): { x: number, y: number } {
        if (0 == deltaX_ && 0 == deltaY_)
            return {
                x: oldX_,
                y: oldY_
            };
        let newXClamp = oldX_ + (deltaX_ = Math.min(deltaX_, XConst.GridHalfSize - .01)),
            newYClamp = oldY_ + (deltaY_ = Math.min(deltaY_, XConst.GridHalfSize - .01)),
            newX = oldX_ + deltaX_,
            newY = oldY_ + deltaY_
        // oldGrid = this.mapPosToGridPos(oldX_, oldY_);
        deltaX_ > 0 ? newX += a : deltaX_ < 0 && (newX -= a), deltaY_ > 0 ? newY += a : deltaY_ < 0 && (newY -= a);
        // let pos = this.mapPosToGridPos(newX, newY);
        return {
            x: newXClamp,
            y: newYClamp
        }
    }
    setWalkable(x_, y_, value_) {
        this._grid.setWalkable(x_, y_, value_)
    }
    setDynWalkable(x_, y_, value_) {
        this._grid.setDynWalkable(x_, y_, value_)
    }

    // isInMap(x_, y_) {
    //     return !(x_ < this.mapBoundBox.minX || x_ > this.mapBoundBox.maxX || y_ < this.mapBoundBox.minY || y_ > this.mapBoundBox.maxY)
    // }

    isInHealZone(x_, y_) {
        for (const i of this._healZones)
            if (i.contains(x_, y_)) return true;
        return false
    }
    stagePosToGridPos(x_, y_) {
        let i = this.stagePosToMapPos(x_, y_);
        return i = this.mapPosToGridPos(i.x, i.y)
    }

    getActiveRoomCnt() {
        let cnt = 0;
        for (const t of this.rooms) t.active && cnt++;
        return cnt
    }
    getRandomRoom(notInclude: XRoomModel) {
        let t = [];
        for (const i of this.rooms) false != i.active && i != notInclude && t.push(i);
        return XRandomUtil.randomInArray(t)
    }
    getMapTiles() {
        return this._tiledMap
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

    get rooms() {
        return this._rooms
    }

    get mapNode() {
        return this._mapNode
    }
    set mapNode(e) {
        this._mapNode = e
    }
    // get mapBoundBox() {
    //     return this._mapBoundBox
    // }
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
        return this.width * XConst.GridSize
    }
    get realHeight() {
        return this.height * XConst.GridSize
    }
}