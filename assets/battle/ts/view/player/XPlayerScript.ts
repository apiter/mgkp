import { _decorator, Component, instantiate, Label, Node, Prefab, sp, Sprite, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { XBuildResult, XBuildType, Direction as XDirection, XGameMode, XGameStatus, XPlayerType, XSkinType } from '../../xconfig/XEnum';
import XPlayerModel from '../../model/XPlayerModel';
import { XEventNames } from '../../event/XEventNames';
import { XConst } from '../../xconfig/XConst';
import XMgr from '../../XMgr';
import { XCfgSkinData } from '../../xconfig/XCfgData';
import XUtil from '../../xutil/XUtil';
import XResUtil from '../../xutil/XResUtil';
import { XRandomUtil } from '../../xutil/XRandomUtil';
import XBuildingModel from '../../model/XBuildingModel';
import { XRoomModel } from '../../model/XRoomModel';
import EventCenter from '../../event/EventCenter';
import LogWrapper, { XLogModule } from '../../log/LogWrapper';
import { XHealthBar } from '../other/XHealthBar';
const { ccclass, property } = _decorator;

@ccclass('XPlayerScript')
export class XPlayerScript extends Component {
    faceDir = 1
    canMove = true
    control = false
    direction = XDirection.Left
    isEscaped = false
    isSkinLoaded = false
    atkIntervalTs = 0
    isFirstFind = true
    getPathCd = false

    data: XPlayerModel = null

    skinNode: Node = null
    aniNode: Node = null
    spineNode: Node = null
    skinBedImgNode: Node = null
    skinCfg: XCfgSkinData = null

    lastMovePos: Vec2 = null
    moveSpeedScale = 1
    moveSpeed = 200

    isAtking = false
    type: XPlayerType
    forceTarget
    curMapBuild
    curPath
    curTarget
    lastAtkTarget

    lbName: Label = null

    init(data_: XPlayerModel) {
        this.data = data_
        data_.ownerScript = this
        data_.owner = this.node

        this.skinNode = new Node
        this.skinNode.name = "skinNode"
        let uiTrans = this.skinNode.addComponent(UITransform)
        uiTrans.setContentSize(XConst.GridSize, XConst.GridSize)
        this.node.addChild(this.skinNode)
        this.node.on(XEventNames.Hp_Changed, this.onHpChanged, this)

        let nameNode = new Node('name')
        this.lbName = nameNode.addComponent(Label)
        this.node.addChild(nameNode)
        nameNode.y = 100
        this.lbName.fontSize = 18
        this.loadSkin()

        this.onInit()
    }

    onInit() { }

    async loadSkin() {
        this.skinCfg = XMgr.cfg.skin.get(this.data.skinId + "");

        // 1. 床的图片
        if (this.skinCfg.skinBedPath) {
            this.skinBedImgNode = new Node(this.skinCfg.skinBedPath)
            let uiTrans = this.skinBedImgNode.addComponent(UITransform)
            uiTrans.anchorX = .5
            uiTrans.anchorY = .35
            this.skinNode.addChild(this.skinBedImgNode)
            this.skinBedImgNode.y = 15
            this.skinBedImgNode.active = false
            XResUtil.loadSpriteFromBundle(XResUtil.ResBundleName, this.skinCfg.skinBedPath.replace(".png", "")).then((frame) => {
                this.skinBedImgNode.addComponent(Sprite).spriteFrame = frame
            })
        }

        // 2. spine 动画资源（.bin 格式）
        if (this.skinCfg.skinPath.includes(".bin")) {
            const path = this.skinCfg.skinPath.replace(".bin", "")
            this.aniNode = new Node("aniNode")
            const uiTrans = this.aniNode.addComponent(UITransform)
            uiTrans.setContentSize(XConst.GridSize, XConst.GridSize)
            uiTrans.anchorPoint = v2(0.5, 0.9)
            this.skinNode.addChild(this.aniNode);

            const spineNode = await XResUtil.loadSpineFromBundle(XResUtil.SpineBundleName, path);
            this.aniNode.addChild(spineNode)
            spineNode.setPosition(v3(0, -XConst.GridHalfSize + 30))
            this.spineNode = spineNode
            spineNode.getComponent(sp.Skeleton).premultipliedAlpha = false

            switch (this.skinCfg.type) {
                case XSkinType.Human:
                    spineNode.scale = v3(0.275, 0.275, 1)
                    break
                case XSkinType.Hunter:
                    spineNode.scale = v3(0.5, 0.5, 1)
                    break
                case XSkinType.Angel:
                    spineNode.scale = v3(0.275, 0.275, 1)
                    break
                case XSkinType.Fighter:
                    spineNode.scale = v3(1, 1, 1)
                    break
                default:

            }
            this.isSkinLoaded = true;
            this.playAnim("idle")
        } else {
            // 3. 静态图片皮肤
        }

        this.lbName.string = this.skinCfg.name
        this.data.name = this.skinCfg.name
    }

    playAnim(aniName_, reStart_ = false, callback_ = null) {
        const spine = this.spineNode.getComponent(sp.Skeleton)
        if (spine.animation != aniName_) {
            spine.animation = aniName_
        }
        // spine.setAnimation(0, aniName_, true)

    }

    onHpChanged() {
        if (this.data.curHp <= 0) {
            this.data.type == XPlayerType.E_Defender && (XMgr.gameMgr.playerDeadCnt += 1)
            this.onDead()
        }
    }

    onDead() {
        LogWrapper.log("流程", `[${this.data.uuid}][${this.data.name}]死亡`, {}, [XLogModule.XLogModuleGameFlow])
        this.skinNode.active = false;
        this.lbName.node.active = false;
        if (this.data.type === XPlayerType.E_Defender) {
            EventCenter.emit(XEventNames.E_Player_Dead)
            if (XMgr.gameMgr.gameMode === XGameMode.E_Defense) {
                if (this.data.uuid === XMgr.playerMgr.mineUuid) {
                    XMgr.gameMgr.gameover(false)
                    XMgr.gameMgr.setGameStatus(XGameStatus.E_GAME_FINISH)
                    LogWrapper.log("流程", "游戏结束,玩家输", {}, [XLogModule.XLogModuleGameFlow])
                } else {

                }
            }
        } else if (this.data.type === XPlayerType.E_Hunter) {
            if (XMgr.gameMgr.gameMode === XGameMode.E_Defense) {
                if (this.data.uuid === XMgr.playerMgr.hunters[0].uuid) {
                    XMgr.gameMgr.gameover(true);
                    XMgr.gameMgr.setGameStatus(XGameStatus.E_GAME_FINISH);
                    LogWrapper.log("流程", "游戏结束,玩家赢", {}, [XLogModule.XLogModuleGameFlow])
                }
            }
        }
    }

    idle() {
    }

    pos(x_, y_) {
        if (this.lastMovePos) {
            this.lastMovePos.set(this.node.x, this.node.y);
        } else {
            this.lastMovePos = new Vec2(this.node.x, this.node.y);
        }

        const preWorld = this.node.worldPosition
        // 移动节点
        this.node.x = x_;
        this.node.y = y_;
        const afterWorld = this.node.worldPosition

        // 更新房间 ID
        this.data.roomId = XMgr.mapMgr.getRoomIdByMapPos(x_, y_);
    }

    move(deltaX_, deltaY_, limit_ = true) {
        // 如果当前不能移动 或者处于控制状态，就直接 return
        if (!this.canMove || this.control) return;

        // 如果 a 为 true，调用限制移动的方法（可能带碰撞检测/边界限制）
        // 否则就是普通移动
        let nextPos = limit_ ? XMgr.mapMgr.limitMove(this.node.x, this.node.y, deltaX_, deltaY_, 16)
            : XMgr.mapMgr.move(this.node.x, this.node.y, deltaX_, deltaY_, 16);

        // 更新位置
        this.pos(nextPos.x, nextPos.y);

        // 根据 i (横向输入) 设置朝向
        if (deltaX_ > 0) {
            this.setFace(1);   // 面向右
        } else if (deltaX_ < 0) {
            this.setFace(-1);  // 面向左
        }

        // 设置方向 (上下左右)
        if (Math.abs(deltaX_) > Math.abs(deltaY_)) {
            this.direction = deltaX_ > 0 ? XDirection.Right : XDirection.Left;
        } else if (Math.abs(deltaX_) < Math.abs(deltaY_)) {
            this.direction = deltaY_ > 0 ? XDirection.Down : XDirection.Up;
        }

        // 播放跑步动画
        this.playAnim("move");
    }

    setFace(t) {
        this.faceDir = t;

        if (this.data.type == XPlayerType.E_Defender) {
            // 防守者：皮肤镜像翻转，建筑保持一致

        } else if (this.data.type == XPlayerType.E_Hunter) {

        }
    }

    getAttackRange() {
        return this.data.stopRange
    }

    isInBed() {
        return this.data.isBed
    }

    getMapBuildTarget() {
        return this.curMapBuild
    }
    setMapBuildTarget(e, t = !1) {
        if (t && (this.forceTarget = e, this.data.curHp < this.data.maxHp)) {
            // 情况1：t 为 true，并且 curHp < maxHp
            // 同时会执行 this.forceTarget = e
        } else if (e != this.curMapBuild) {
            // 情况2：目标和当前不同
            this.curMapBuild = e;
            this.curPath = null;
        }
    }
    takeMapBuild(e) {
        if (e && !e.isUsed) {
            // this.takeMapBuildNode.addChild(e.node);
            // e.node.pos(0, 0);
            // return XMgr.buildingMgr.takeMapBuild(e.x, e.y, this.data);
        }
    }

    getTakeMapBuild() {
        return this.data.takeMapBuild
    }
    getCurTarget() {
        return this.curTarget
    }

    setCurTarget(target_) {
        // 如果是第一次找目标，标记已处理
        if (this.isFirstFind) {
            this.isFirstFind = false;
        }


        // 否则，如果目标和当前目标不同
        if (target_ !== this.curTarget) {
            // 把当前目标存到 lastAtkTarget
            if (this.curTarget) {
                this.lastAtkTarget = this.curTarget;
            }
            // 更新目标
            this.curTarget = target_;
            // 路径清空，等待重新寻路
            this.curPath = null;
        }
    }

    getAllRoomIdRand() {
        let allRooms = XMgr.buildingMgr.rooms,
            activeRoom = [];
        for (const t in allRooms)
            allRooms[t].active && activeRoom.push(t);
        return XRandomUtil.randomArray(activeRoom)
    }

    isBedUsed(bed_: XBuildingModel) {
        return bed_.isUsed
    }

    getRoomModel(roomId_ = undefined) {
        !roomId_ && (roomId_ = this.getOwnerRoomId())
        return XMgr.buildingMgr.getRoom(roomId_)
    }

    getOwnerRoomId() {
        return this.data.roomId
    }

    targetIsOK(target) {
        if (target instanceof XPlayerModel) {
            return !target.isDie;
        } else if (target instanceof XBuildingModel) {
            return !target.isOpen && target.curHp > 0;
        } else {
            return !!target && !target.isDie;
        }
    }

    getTargetPos(target = null) {
        if (!(target || this.curTarget && this.curTarget.owner)) return;

        let owner = target ? target.owner : this.curTarget.owner;
        return owner ? new Vec2(owner.x, owner.y) : void 0
    }

    getCurPath() {
        return this.curPath
    }

    setCurPath(e) {
        this.curPath = e
    }

    getOwnerPos() {
        return this.node.getPosition()
    }

    getOwnerGridPos() {
        let e = this.getOwnerPos()
        let worldPt = this.node.parent.getComponent(UITransform).convertToWorldSpaceAR(v3(e));
        let s = XMgr.mapMgr.stagePosToGridPos(worldPt.x, worldPt.y);
        e.set(s.x, s.y)
        return e
    }

    breakAway() {
        this.curPath && (this.curPath = []);
        let grid = this.getOwnerGridPos()
        let emptyGrids = XMgr.buildingMgr.getOutdoorEmptyGrids(grid.x, grid.y, 2);
        let randGrid = XRandomUtil.randomInArray(emptyGrids)
        let mapPos = XMgr.mapMgr.gridPosToMapPos(randGrid.x, randGrid.y)
        this.node.x = mapPos.x
        this.node.y = mapPos.y
    }

    getPath(startPos_, endPos_, slant_ = false) {
        if (!this.node.isValid || this.getPathCd) return;
        let pathPoints = XMgr.mapMgr.findPath(startPos_.x, startPos_.y, endPos_.x, endPos_.y, slant_);
        if (!pathPoints || pathPoints.length === 0) {
            this.getPathCd = true;
            this.scheduleOnce(() => {
                this.getPathCd = false;
            }, 2)
        }
        return pathPoints
    }

    runWithPath(points_: Vec2[], canThrough_ = false) {
        if (points_.length == 0)
            return true;
        let curerntPoint = points_[0];
        let ownPos = this.getOwnerPos()
        let deltaVec = (v2(ownPos.x, ownPos.y)).subtract(v2(curerntPoint.x, curerntPoint.y)).multiplyScalar(-1)
        let dis = deltaVec.length()

        // 已经到达目标点
        if (dis <= 1e-6) {
            points_.shift(); // 移除当前点
            return this.runWithPath(points_); // 递归继续走下一个点
        }

        {
            // 每帧的时间间隔
            let dt = XUtil.getFrameDelta();

            // 速度倍率
            let pow = this.data ? this.data.getSpeedPow() : 1;

            // 基础速度
            let r = this.moveSpeed * pow;

            if (this.data.type == XPlayerType.E_Hunter) {
                // 猎人移动：X 轴会被放大处理
                deltaVec = XUtil.normalize(deltaVec, Math.min(r * dt, dis))

                if (deltaVec.x != 0) {
                    deltaVec.x *= 2; // 横向速度更快？
                    if (deltaVec.x > 0) {
                        deltaVec.x = Math.min(deltaVec.x, dis);
                    } else {
                        deltaVec.x = Math.max(deltaVec.x, -dis);
                    }
                }
            } else {
                // 防守者移动
                deltaVec = XUtil.normalize(deltaVec, Math.min(r * dt, dis))
            }

            // 检测是否可走
            if (this.checkWalkAble(deltaVec.x, deltaVec.y)) {
                this.move(deltaVec.x, deltaVec.y, !canThrough_);
            } else {
                this.setCurPath(null); // 走不通，清掉路径
            }
        }

        return false;
    }

    checkWalkAble(x_, y_) {
        let s = new Vec2(this.data.owner.x + x_, this.data.owner.y + y_)
        let grid = XMgr.mapMgr.mapPosToGridPos(s.x, s.y)
        let tileInfo = XMgr.mapMgr.getTiledInfo(grid.x, grid.y);
        return tileInfo && (tileInfo.walkable === true);
    }

    getDataModel() {
        return this.data
    }

    gotoBed(gridX_, gridY_) {
        return XMgr.gameMgr.upBed(gridX_, gridY_, this.data.uuid) == XBuildResult.E_OK
    }

    hasEnoughCoinEnergy(buildModel_: XBuildingModel, currentLv_ = null) {
        let lv = currentLv_ ? buildModel_.lv : buildModel_.lv + 1
        let buildCfg = XMgr.buildingMgr.getBuildCfg(buildModel_.id, lv);
        if (buildCfg) {
            let playModel = this.data;
            if (playModel.coin >= buildCfg.coin && playModel.energy >= buildCfg.energy)
                return true
        }
        return false
    }

    upgradeBuilding(i) {
        let s = this.hasEnoughCoinEnergy(i);
        return XMgr.buildingMgr.upgrade(this.data.uuid, i.x, i.y) == XBuildResult.E_OK
    }


    getOwnerAllBuildings(buildType = null) {
        let roomModel = this.getRoomModel();
        if (!roomModel) return [];

        let playUuid = this.data.uuid;
        let a = playUuid.indexOf("_");
        playUuid = playUuid.slice(a + 1);

        let ret: XBuildingModel[] = [];

        for (const build of roomModel.buildings) {
            if (
                build.playerUuid &&
                build.playerUuid == playUuid &&
                (!buildType || build.type == buildType)
            ) {
                ret.push(build);
            }
        }

        return ret;
    }

    getOwnerBed() {
        let beds = this.getOwnerAllBuildings(XBuildType.bed);
        return beds[0]
    }
    getRoomDoor() {
        let roomModel = this.getRoomModel();
        return roomModel && roomModel.doorModel && !roomModel.doorModel.isDie ? roomModel.doorModel : null
    }

    createBuilding(buildModel_) {
        let splitArr = buildModel_.split("_")
        let buildId = splitArr[0]
        let lv = +splitArr[1]
        let buildCfg = XMgr.buildingMgr.getBuildCfg(buildId, lv)
        let buildModel = XMgr.buildingMgr.createBuildingModelByCfg(this.data.uuid, buildId, this.getOwnerRoomId(), lv, 0, 0, 0, buildCfg);
        if (buildModel.type == XBuildType.tower) {
            let doorModel = this.getRoomModel().doorModel as XBuildingModel
            let emptyBlock = this.getEmptyBlock(v2(doorModel.x, doorModel.y));
            if (!emptyBlock) return;
            buildModel.x = emptyBlock.x, buildModel.y = emptyBlock.y
        } else {
            let emptyBlock = this.getEmptyBlock();
            if (!emptyBlock) return;
            buildModel.x = emptyBlock.x, buildModel.y = emptyBlock.y
        }
        return buildModel
    }

    getEmptyBlock(pos: Vec2 = null) {
        let grids = XMgr.buildingMgr.getEmptyGrids(this.getOwnerRoomId());
        if (0 == grids.length) return;
        let ret;
        if (pos) {
            let nowMinDis = Number.MAX_SAFE_INTEGER;
            for (const grid of grids) {
                let dis = Vec2.squaredDistance(pos, grid);
                dis < nowMinDis && (nowMinDis = dis, ret = grid)
            }
        } else ret = XRandomUtil.randomInArray(grids);
        return ret
    }

    getAttackCd() {
        return this.data.getAtkCD()
    }

    getLastAtkTarget() {
        return this.lastAtkTarget
    }

    setLastAtkTarget(target_) {
        this.lastAtkTarget = target_
    }

    attack(target_) {

    }

    getNearestBuilding() {
        let playerPosInMap = this.getOwnerPos()
        let nearBuilding = XMgr.buildingMgr.getNearBuildingByMapPos2(playerPosInMap.x, playerPosInMap.y);
        if (nearBuilding && true !== nearBuilding.isOpen)
            return nearBuilding
    }


    getAllPlayersRand() {
        let ret: XPlayerModel[] = [];
        for (const defender of XMgr.playerMgr.defenders)
            ret.push(defender);
        return ret = XRandomUtil.randomArrayEx(ret)
    }

    isEscapeHp() {
        return this.data.hpPercent <= 0.33
    }

    getHpPercent() {
        return this.data.hpPercent
    }

    setEscape(value_) {
        this.isEscaped = value_
    }

    isEscape() {
        return this.isEscaped
    }

    createHealthBar() {
        let prefab = XMgr.prefabMgr.pf_health_bar
        const node = instantiate(prefab)
        XMgr.mapMgr.barLayer.addChild(node)
        const healthBar = node.getComponent(XHealthBar)
        healthBar.init(this.data, this.data.type != XPlayerType.E_Defender, 128)
    }
}


