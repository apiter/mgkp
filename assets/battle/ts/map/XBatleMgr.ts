import { director, game, ISchedulable, math, view } from "cc"
import XMatchData from "../model/XMatchData"
import { XToast } from "../view/XToast"
import { XBuildResult, XBuildType, XGameMode, XGameStatus, XPlayerType } from "../xconfig/XEnum"
import XMgr from "../XMgr"
import { XRandomUtil } from "../xutil/XRandomUtil"
import EventCenter from "../event/EventCenter"
import { XEventNames } from "../event/XEventNames"
import XUtil from "../xutil/XUtil"
import XPlayerModel from "../model/XPlayerModel"
import { XCfgMapCfgItem, XCfgMapData, XDifficultCfgItem } from "../xconfig/XCfgData"
import { XInputScript } from "../view/XInputScript"
import LogWrapper, { XLogModule } from "../log/LogWrapper"
import XBaseModel from "../model/XBaseModel"

export class XBatleMgr implements ISchedulable {
    uuid?: string
    id?: string

    _isPause: boolean = false
    speedRatio = 1
    hunterSpeedRatio = 1
    mapId = 0
    gameStatus = XGameStatus.E_GAME_READY
    gameMode = XGameMode.E_Defense
    playTime: number = 0
    matchData: XMatchData = null
    mapCfg: XCfgMapCfgItem = null
    startTime = 0
    randomCnt = 0
    buildCnt = 0
    playerDeadCnt = 0
    defenseDeadCnt = 0
    defenseFindRoomId = []
    aiMultArr = []
    dCfg: XDifficultCfgItem
    playerNames: string[] = []

    inputScript: XInputScript = null
    aiRatios = []

    isDefender() {
        return XMgr.playerMgr.player.type == XPlayerType.E_Defender
    }
    isHunter() {
        return XMgr.playerMgr.player.type == XPlayerType.E_Hunter
    }

    match(gameMode_: XGameMode, defenderArr_: XPlayerModel[], hunterArr_: XPlayerModel[], mapCfg_: XCfgMapCfgItem, mapData_: XCfgMapData) {
        let matchData = new XMatchData;
        matchData.gameMode = gameMode_
        matchData.mapCfg = mapCfg_
        matchData.mapData = mapData_;

        this.mapId = mapCfg_.id

        let mineIdx = 0
        let defenderPointArr = [];
        for (let i = 0; i < mapCfg_.defenderPointNum; ++i)
            defenderPointArr.push(i);
        XRandomUtil.randomArray(defenderPointArr);

        for (let i = 0; i < defenderArr_.length; ++i) {
            let defender = defenderArr_[i];
            defender.spwanPoint = defenderPointArr[i]
            gameMode_ != XGameMode.E_Hunt && i == mineIdx && (matchData.mineUuid = defender.uuid)
            matchData.defenders.push(defender)
        }
        let hunterPointArr = [];
        for (let i = 0; i < mapCfg_.hunterPointNum; ++i)
            hunterPointArr.push(i);
        XRandomUtil.randomArray(hunterPointArr);
        for (let i = 0; i < hunterArr_.length; ++i) {
            let s = hunterArr_[i];
            s.spwanPoint = hunterPointArr[i]
            gameMode_ == XGameMode.E_Hunt && i == mineIdx && (matchData.mineUuid = s.uuid)
            matchData.hunters.push(s)
        }
        matchData.players = matchData.hunters.concat(matchData.defenders)
        return matchData
    }

    start(matchData_: XMatchData) {
        this.gameStatus = XGameStatus.E_GAME_READY
        this.matchData = matchData_
        this.gameMode = matchData_.gameMode
        this.mapCfg = matchData_.mapCfg
        XMgr.playerMgr.init(matchData_)
        XMgr.mapMgr.init(matchData_.mapData)
        XMgr.buildingMgr.init()
        this.startTime = XMgr.gameTime.getTime()
        this.randomCnt = 0
        this.playTime = 0
        this.buildCnt = 0
        this.playerDeadCnt = 0
        this.defenseDeadCnt = 0
        this.defenseFindRoomId = []
        this.aiRatios = [0.7, 0.75, 0.65, 0.4, 0.7, 0.85, 0.5];
        this.speedRatio = 0.75;
        this.hunterSpeedRatio = 0.75 / XMgr.gameMgr.dCfg.moveSpeed || 1;


        this.aiMultArr = XRandomUtil.randomInArray([
            [1.6, 1.7, 1.8, 1.9, 2],
            [1.3, 1.4, 1.5, 1.6, 1.7],
            [1.2, 1.3, 1.4, 1.5, 1.6],
            [1.1, 1.2, 1.3, 1.4, 1.5],
            [1, 1.05, 1.1, 1.15, 1.2]
        ])
    }
    loopTime() {
        this.playTime++
    }
    setGameStatus(status_: number) {
        this.gameStatus = status_
        status_ == XGameStatus.E_GAME_START && EventCenter.emit(XEventNames.E_Game_Start)
    }
    get isPause() {
        return this._isPause
    }
    set isPause(value_) {
        this._isPause = value_
    }
    pauseGame() {
        game.pause()
        this.gameStatus != XGameStatus.E_GAME_READY && this.setGameStatus(XGameStatus.E_GAME_PAUSE)
    }
    resumeGame() {
        game.resume()
        this.gameStatus != XGameStatus.E_GAME_READY && this.setGameStatus(XGameStatus.E_GAME_START)
    }
    changeMaxHp(model, maxHp_, curHp_) {
        // 如果新 maxHp 小于原来的 maxHp，限制当前血量在 [0, t] 范围内
        maxHp_ < model.maxHp && (model.curHp = math.clamp(model.curHp, 0, maxHp_));

        // 更新 maxHp
        model.maxHp = maxHp_;

        // 如果有 doorkeeper，顺带修改它的血量
        model.doorkeeper && (
            model.doorkeeper.maxHp = maxHp_,
            model.doorkeeper.curHp = curHp_,
            model.doorkeeper.owner && model.doorkeeper.owner.event(XEventNames.Hp_Changed)
        );

        // 如果 i 不为 null，则设置 curHp，并处理死亡状态
        null != curHp_ && (
            model.curHp = curHp_,
            model.curHp = math.clamp(model.curHp, 0, model.maxHp),
            model.isDie = (0 == model.curHp)
        );

        // 通知血量变化
        model.owner && model.owner.emit(XEventNames.Hp_Changed);
    }

    /**
     * 
     * @param baseModel_ the one who attack
     * @param target_ the one attacked
     * @param atk_ damage
     * @returns 
     */
    takeDamage(baseModel_, target_, atk_) {
        if (!target_.isDie && !target_.invincible && !target_.invincible_skill && atk_ > 0) {
            target_.reduceRate && (atk_ *= 1 - target_.reduceRate)
            if (target_.type == XBuildType.bed && target_.playerUuid) {
                let player = XMgr.playerMgr.getPlayer(target_.playerUuid);
                if (player.invincibleCnt)
                    return void (player.invincibleCnt -= 1)
            }

            if (target_.skillEquipHp) {
            } else {
                // 扣血
                target_.curHp -= atk_;
                target_.curHp = Math.max(target_.curHp, 0);
            }

            // 是否死亡
            target_.isDie = (target_.curHp <= 0);

            // 通知事件
            if (target_.owner) {
                target_.owner.emit(XEventNames.Hp_Changed, target_)
            }

            if (target_.isDie) {
                let target = target_;

                if (target.type == XBuildType.bed && target.playerUuid) {
                    let player = XMgr.playerMgr.getPlayer(target.playerUuid);
                    this.takeDamage(baseModel_, player, atk_);
                }
            }
        }
        const msg = `[${baseModel_.name || baseModel_?.ownerScript?.cfg?.name}]对[${target_?.name || target_?.ownerScript?.cfg?.name}]造成${atk_}伤害 剩余血量:${target_.curHp}`
        LogWrapper.log("战斗", msg, {}, [XLogModule.XLogModuleBattle])
    }

    heartSound(e) {
    }

    addHp(modelData_: XBaseModel, addPercent_) {
        if (modelData_.isDie) return;
        if (addPercent_ <= 0) return;
        let i = addPercent_ * modelData_.maxHp;
        modelData_.curHp += addPercent_ * modelData_.maxHp
        modelData_.curHp = Math.min(modelData_.curHp, modelData_.maxHp)
        modelData_.isDie = 0 == modelData_.curHp
        modelData_.owner && modelData_.owner.emit(XEventNames.Hp_Changed, -i)
    }
    addDataInArr(e) {

    }
    revive() { }
    get mineRoom() {
        let roomId = XMgr.playerMgr.player.roomId;
        return XMgr.buildingMgr.getRoom(roomId)
    }
    isRoomBedUsed(roomId_) {
        let room = XMgr.buildingMgr.getRoom(roomId_);
        if (room) {
            for (const bed of room.bedModelList)
                if (bed.isUsed && !bed.isDie) return true;
            return false
        }
    }
    upBed(gridX_, gridY_, playerUuid_) {
        let playModel = XMgr.playerMgr.getPlayer(playerUuid_);
        let buildModel = XMgr.buildingMgr.getBuilding(gridX_, gridY_);

        if (buildModel && buildModel.type == XBuildType.bed && XMgr.buildingMgr.getRoom(buildModel.roomId)) {
            if (buildModel.isUsed) {
                return XBuildResult.E_BED_IS_USED;
            } else {
                return XMgr.buildingMgr.upBed(gridX_, gridY_, playModel);
            }
        }
        return XBuildResult.E_FAILD;
    }

    canLocatePlayer() {
        if (this.isHunter()) {
            return this.gameStatus == XGameStatus.E_GAME_READY;
        } else if (this.isDefender()) {
            return XMgr.playerMgr.isPlayerBed(XMgr.playerMgr.mineUuid);
        }
        return false;
    }

    dizzyTarget(e, t, bPlayEffect_ = true) {
        e.dizzyStartTime = game.totalTime;
        e.dizzyDurSec = t;
    }

    gameover(isWin_) {
    }

    takeMapBuild(x_, y_, playerUuid_) {
        let player = XMgr.playerMgr.getPlayer(playerUuid_),
            mapBuild = XMgr.buildingMgr.getMapBuild(x_, y_);
        return (!mapBuild || !mapBuild.isUsed) && XMgr.buildingMgr.takeMapBuild(x_, y_, player)
    }

    nodeIsInPlayerView(pos_) {
        let i = XMgr.mapMgr.mapPosToStagePos(pos_.x, pos_.y);
        return !(i.x < 0 || i.x > view.getVisibleSize().width) && !(i.y < 0 || i.y > view.getVisibleSize().height)
    }

    isInPlayerView(player) {
        return this.nodeIsInPlayerView(player.owner)
    }

    isChooseBuff() {
        let e = false;
        return e
    }

    randomName(e = 0) {
        return "随机名字"
    }

    clearRandomName() {
        this.playerNames = null
    }
}