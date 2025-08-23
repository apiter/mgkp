import { director, game, ISchedulable, math } from "cc"
import XMatchData from "../model/XMatchData"
import { XToast } from "../view/XToast"
import { XBuildType, XGameMode, XGameStatus, XPlayerType } from "../xconfig/XEnum"
import XMgr from "../XMgr"
import { XRandomUtil } from "../xutil/XRandomUtil"
import EventCenter from "../event/EventCenter"
import { XEventNames } from "../event/XEventNames"

export class XBatleMgr implements ISchedulable{
    uuid?: string
    id?: string

    _isPause: boolean = false
    diff = 0
    isShowTurntable = false
    skillABTest = -1
    difficultABTest = 1
    speedRatio = 1
    hunterSpeedRatio = 1
    mapId = 0
    gameStatus = XGameStatus.E_GAME_READY
    gameMode = XGameMode.E_Defense
    playTime: number = 0
    _arrDatas = []
    matchData: XMatchData = null
    mapCfg
    startTime = 0
    killCnt = 0
    randomCnt = 0
    isfreeUpDoor = false
    buildCnt = 0
    adCnt = 0
    playerDeadCnt = 0
    isUsedSuper = false
    defenseDeadCnt = 0
    defenseFindRoomId = []
    isAdMagicBox = false
    canChooseBuff = false
    chooseBuffLv = 0
    isOpenSevenGhost = false
    aiRatios = []
    aiMultArr = []
    curHunterAtkTarget = null
    dCfg
    playerNames: string[] = []

    constructor() {
    }

    isDefender() {
        return XMgr.playerMgr.player.type == XPlayerType.E_Defender
    }
    isHunter() {
        return XMgr.playerMgr.player.type == XPlayerType.E_Hunter
    }
    randomDiff(e) {
        let i = [
            [0, 1],
            [0, 1, 2],
            [1, 2]
        ],
            s = XMgr.user.gameInfo.winCnt + XMgr.user.gameInfo.failCnt,
            a = 0;
        if (1 == e)
            for (let e = 0; e < 1; e++) a = s < 5 ? e : 1;
        else a = s < 5 ? 0 : 1;
        let n = Math.floor(XRandomUtil.random() * i[a].length);
        this.diff = i[a][n], this.diff > 3 && (this.diff = 0)
    }
    match(gameMode_, defenderArr_, hunterArr_, mapCfg_, mapData_, o) {
        let l, h = new XMatchData;
        h.gameMode = gameMode_, this.randomDiff(mapCfg_.id),
            h.mapCfg = mapCfg_, this.mapId = mapCfg_.id, h.mapData = mapData_,
            gameMode_ == XGameMode.E_Defense ? l = 0 : gameMode_ == XGameMode.E_Hunt ? l = 0 : gameMode_ == XGameMode.E_AngelOrGhost ? l = 0 : gameMode_ == XGameMode.E_SevenGhost && (l = 0);
        let d = [];
        for (let e = 0; e < mapCfg_.defenderPointNum; ++e) d.push(e);
        XMgr.user.gameInfo.winCnt + XMgr.user.gameInfo.failCnt != 0 && XRandomUtil.randomArray(d);
        for (let t = 0; t < defenderArr_.length; ++t) {
            let a = defenderArr_[t];
            a.spwanPoint = d[t], gameMode_ != XGameMode.E_Hunt && t == l && (h.mineUuid = a.uuid), h.defenders.push(a)
        }
        d = [];
        for (let e = 0; e < mapCfg_.hunterPointNum; ++e) d.push(e);
        XRandomUtil.randomArray(d);
        for (let t = 0; t < hunterArr_.length; ++t) {
            let s = hunterArr_[t];
            s.spwanPoint = d[t], gameMode_ == XGameMode.E_Hunt && t == l && (h.mineUuid = s.uuid), h.hunters.push(s)
        }
        return h.players = [], h.players = h.hunters.concat(h.defenders), h
    }
    start(matchData_: XMatchData) {
        this._arrDatas = []
        this.gameStatus = XGameStatus.E_GAME_READY
        this.matchData = matchData_
        this.gameMode = matchData_.gameMode
        this.mapCfg = matchData_.mapCfg
        XMgr.playerMgr.init(matchData_)
        XMgr.mapMgr.init(matchData_.mapData, 0)
        XMgr.buildingMgr.init()
        t.taskMgr.init()
        this.startTime = XMgr.gameTime.getTime()
        this.killCnt = 0, this.randomCnt = 0
        this.isfreeUpDoor = !1
        this.curHunterAtkTarget = null
        this.playTime = 0
        this.buildCnt = 0
        this.adCnt = 0
        this.playerDeadCnt = 0, this.isUsedSuper = !1, this.defenseDeadCnt = 0
        this.defenseFindRoomId = []
        this.isAdMagicBox = !1
        Laya.timer.clear(this, this.loopTime), Laya.timer.loop(1e3, this, this.loopTime);
        let s = XMgr.user.gameInfo;
        if (1 == this.difficultABTest ? (this.aiRatios = [.7, .75, .65, .4, .7, .85, .5], this.speedRatio = .75, this.hunterSpeedRatio = .75 / t.gameMgr.dCfg.moveSpeed || 1, console.log(1 / this.hunterSpeedRatio, t.gameMgr.dCfg.moveSpeed, "real Speed")) : (this.aiRatios = [.7, .75, .65, .4, .7, .85, .5], this.speedRatio = this.hunterSpeedRatio = 1), t.gameMgr.gameMode == e.GameMode.E_Defense && (s.isStartLv || s.curLv > 1)) {
            let e = this.dCfg;
            s.curLv != s.lastLv ? s.isLastWin ? XToast.show(`难度上升：${e.name}`) : XToast.show(`难度降低：${e.name}`) : XToast.show(`难度：${e.name}`)
        } else if (XMgr.gameMgr.gameMode == XGameMode.E_AngelOrGhost)
            XToast.show("大战木头人即将开始");
        else if (XMgr.gameMgr.gameMode == XGameMode.E_Hunt) {
            let e = this.dCfg;
            s.curHunterLv != s.lastHunterLv ? s.isLastHunterWin ? XToast.show(`难度上升：${e.name}`) : XToast.show(`难度降低：${e.name}`) : XToast.show(`难度：${e.name}`)
        } else XMgr.gameMgr.gameMode == XGameMode.E_SevenGhost && XToast.show("挑战模式开始");
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
    set isPause(e) {
        this._isPause = e
    }
    pauseGame() {
        game.pause()
        this.gameStatus != XGameStatus.E_GAME_READY && this.setGameStatus(XGameStatus.E_GAME_PAUSE)
    }
    resumeGame() {
        game.resume()
        this.gameStatus != XGameStatus.E_GAME_READY && this.setGameStatus(XGameStatus.E_GAME_START)
    }
    changeMaxHp(e, t, i) {
        t < e.maxHp && (e.curHp = math.clamp(e.curHp, 0, t)), e.maxHp = t, e.doorkeeper && (e.doorkeeper.maxHp = t, e.doorkeeper.curHp = i, e.doorkeeper.owner && e.doorkeeper.owner.event(be.Hp_Changed)), null != i && (e.curHp = i, e.curHp = Math.clamp(e.curHp, 0, e.maxHp), e.isDie = 0 == e.curHp), e.owner && e.owner.event(be.Hp_Changed)
    }
    takeDamage(i, s, a) {
        if (!s.isDie && !(s.invincible || s.invincible_skill || a <= 0)) {
            if (s.reduceRate && (a *= 1 - s.reduceRate), s.type == XBuildType.bed && s.playerUuid) {
                let e = XMgr.playerMgr.getPlayer(s.playerUuid);
                if (e.invincibleCnt) return void (e.invincibleCnt -= 1)
            }

            if (s.skillEquipHp) {
                // 技能护盾减血
                s.skillEquipHp -= a;
                if (s.skillEquipHp <= 0) {
                    s.skillEquipHp = 0;
                    s.ownerScript.changeSkin(false);
                }
            } else {
                // 扣血
                s.curHp -= a;
                s.curHp = Math.max(s.curHp, 0);
            
                // 狩猎模式下，血量小于10%，触发阎罗显示
                if (this.gameMode == XGameMode.E_Hunt && s.curHp > 0 && (s.curHp / s.maxHp < 0.1)) {
                    if (s != XMgr.playerMgr.player && !s.isShowYanluo) {
                        s.isShowYanluo = true;
                        EventCenter.emit(XEventNames.E_Yanluo_Show);
                    }
                }
            }
            
            // 是否死亡
            s.isDie = (s.curHp == 0);
            
            // 通知事件
            if (s.owner) {
                s.owner.event(XEventNames.Hp_Changed, [i]);
                s.owner.event(XEventNames.Battle_Be_Hit, [i, a]);
            }
            
            if (s.isDie) {
                let n = s;
            
                // 床被打爆，递归调用伤害
                if (n.type == XBuildType.bed && n.playerUuid) {
                    let e = XMgr.playerMgr.getPlayer(n.playerUuid);
                    this.takeDamage(i, e, a);
                }
            
                // 门被打爆，触发心跳声
                if (n.type == XBuildType.door) {
                    let e = XMgr.playerMgr.getPlayer(n.playerUuid);
                    this.heartSound(e);
                }
            }

            if (s.type == XBuildType.door && this.curHunterAtkTarget != s && !i.isGhost) {
                this.curHunterAtkTarget = s;
                let e = XMgr.mapMgr.getRoomById(s.roomId);
                EventCenter.emit(XEventNames.E_Player_Hurt, e.bedModelList[0].playerUuid)
            }
        }
    }
    heartSound(e) {
    }
    AddHp(e, t) {
        if (e.isDie) return;
        if (t <= 0) return;
        let i = t * e.maxHp;
        e.curHp += t * e.maxHp, e.curHp = Math.min(e.curHp, e.maxHp), e.isDie = 0 == e.curHp, e.owner && e.owner.event(be.Hp_Changed, [-i])
    }
    get arrDatas() {
        return this._arrDatas
    }
    set arrDatas(e) {
        this._arrDatas = e
    }
    addDataInArr(e) {
        for (let t = 0; t < this.arrDatas.length; t++) {
            let i = this.arrDatas[t];
            if (i.x == e.x && i.y == e.y) return void (this.arrDatas[t] = e)
        }
        this.arrDatas.push(e)
    }
    revive() { }
    get mineRoom() {
        let roomId = XMgr.playerMgr.player.roomId;
        return XMgr.buildingMgr.getRoom(roomId)
    }
    isRoomBedUsed(e) {
        let i = XMgr.buildingMgr.getRoom(e);
        if (i) {
            for (const e of i.bedModelList)
                if (e.isUsed && !e.isDie) return !0;
            return !1
        }
    }
    upBed(i, s, a) {
        let n = XMgr.playerMgr.getPlayer(a),
            r = t.buildingMgr.getBuilding(i, s);
        return r && r.type == XBuildType.bed && XMgr.buildingMgr.getRoom(r.roomId) ? r.isUsed ? e.BuildResult.E_BED_IS_USED : t.buildingMgr.upBed(i, s, n) : e.BuildResult.E_FAILD
    }
    canHandleGrid(i, s, a) {
        let n = t.playerMgr.mineUuid;
        a = a || n;
        let r = t.mapMgr.getRoomIdByGridPos(i, s),
            o = t.playerMgr.getPlayer(a),
            l = t.buildingMgr.getBuilding(i, s);
        if (!l && r == o.roomId) return !0;
        if (-1 != r && l)
            if (l.type == XBuildType.door) {
                if (l.roomId == o.roomId) return !0
            } else if (l.playerUuid == a) return !0;
        return !1
    }
    canLocatePlayer() {
        return this.isHunter() ? this.gameStatus == e.GameStatus.E_GAME_READY : this.isDefender() ? t.playerMgr.isPlayerBed(t.playerMgr.mineUuid) : void 0
    }
    DizzyTarget(e, t, i = !0) {
        e.dizzyStartTime = Laya.timer.currTimer, e.dizzyDurSec = t, i && EffectUtil.I.playDizzyEffect(e.owner.x, e.owner.y - 100, t)
    }
    gameover(i, s = 1) {
        let a = t.user.gameInfo,
            n = XMgr.cfg.skin.get(a.curSkinId);
        if (this.gameMode == XGameMode.E_Defense) {
            if (a.isLastWin = i, a.lastLv = a.curLv, a.isStartLv && this.gameMode == e.GameMode.E_Defense && (a.isMapByWeek = !0), i) {
                XAnalyticsUtil.passLevel(s, "普通模式", n.name);
                let e = t.cfg.difficultCfg.length;
                if (a.curLv > a.maxLevel) {
                    a.maxLevel = a.curLv, t.reporter.setUserMaxLevel(a.maxLevel);
                    let e = t.cfg.difficultCfg.get(a.maxLevel);
                    XToast.show(`称号上升：${e.title}`)
                }
                if (a.curLv == e && (a.maxWinCnt += 1), a.weekMaxLv < a.curLv && (a.weekMaxLv = a.curLv), a.todayMaxLv < a.curLv) {
                    if (a.hunterUnlockLvl += 1, a.hunterUnlockLvl && a.hunterUnlockLvl % 2 == 0) {
                        let e = t.cfg.getHunterSkillArr();
                        for (let t = 0; t < e.length; t++) {
                            let i = e[t].id;
                            if (!a.isUnlockHunterSkin(i)) {
                                a.unlockHunterSkin(i);
                                break
                            }
                        }
                    }
                    a.todayMaxLv = a.curLv;
                    let e = t.user.gameInfo.todayMaxLv;
                    t.rankMgr.setCustomRankValue("score_day", e, t.user.gameInfo.curSkinId)
                } else a.curLv >= t.cfg.difficultCfg.length && (a.todayExtraScore += 1, a.todayMaxLv < a.curLv + a.todayExtraScore && (a.todayMaxLv += 1, t.rankMgr.setCustomRankValue("score_day", a.todayMaxLv, t.user.gameInfo.curSkinId)));
                a.buffLvArr.includes(a.curLv) || (this.canChooseBuff = !0, this.chooseBuffLv = a.curLv)
            } else XAnalyticsUtil.loseLevel("普通模式", n.name), a.todayExtraScore ? a.todayExtraScore -= 1 : a.curLv > a.lowestLv && a.setCurLv(a.lowestLv);
            t.user.saveToServer()
        } else if (this.gameMode == e.GameMode.E_AngelOrGhost) {
            let e = n.name;
            t.playerMgr.player.isAngel ? e = "救援者" : t.playerMgr.player.isGhost && (e = "执行人"), i ? XAnalyticsUtil.passLevel(s, "木头人模式", e) : XAnalyticsUtil.loseLevel("木头人模式", e)
        } else if (this.gameMode == e.GameMode.E_Hunt) {
            a.isLastHunterWin = i, a.lastHunterLv = a.curHunterLv;
            let e = t.cfg.skin.get(a.curHunterSkinId);
            if (i) {
                if (XAnalyticsUtil.passLevel(s, "噬魂者模式", e.name), a.curHunterLv > a.maxHunterLevel) {
                    a.maxHunterLevel = a.curHunterLv;
                    let e = t.cfg.hunterDifficultCfg.get(a.maxHunterLevel);
                    XToast.show(`称号上升：${e.title}`)
                }
                if (a.todayHunterMaxLv < a.curHunterLv) {
                    a.todayHunterMaxLv = a.curHunterLv;
                    let e = t.user.gameInfo.todayHunterMaxLv;
                    t.rankMgr.setCustomRankValue("score_hunter_day", e, t.user.gameInfo.curHunterSkinId)
                } else a.curHunterLv >= t.cfg.hunterDifficultCfg.length && (a.todayHunterExtraScore += 1, a.todayHunterMaxLv < a.curHunterLv + a.todayHunterExtraScore && (a.todayHunterMaxLv += 1, t.rankMgr.setCustomRankValue("score_hunter_day", a.todayHunterMaxLv, t.user.gameInfo.curHunterSkinId)))
            } else XAnalyticsUtil.loseLevel("噬魂者模式", e.name), a.todayHunterExtraScore ? a.todayHunterExtraScore -= 1 : a.curHunterLv > a.lowestHunterLv && a.setCurHunterLv(a.lowestHunterLv);
            t.user.saveToServer()
        } else this.gameMode == XGameMode.E_SevenGhost && (i ? (a.curSevenGhostLv == t.cfg.sevenGhostCfg.length ? (a.curSevenGhostLv = 1, a.isUnlockSkin(1003) || (a.unlockSkin(1003), this.isOpenSevenGhost = !0)) : a.curSevenGhostLv += 1, XAnalyticsUtil.passLevel(s, "挑战模式", n.name)) : (a.curSevenGhostLv = 1, XAnalyticsUtil.loseLevel("挑战模式", n.name)), t.user.saveToServer())
    }
    takeMapBuild(e, i, s) {
        let a = t.playerMgr.getPlayer(s),
            n = t.buildingMgr.getMapBuild(e, i);
        return (!n || !n.isUsed) && t.buildingMgr.takeMapBuild(e, i, a)
    }
    playSoundByNode(t, i, s) {
        this.gameStatus == XGameStatus.E_GAME_START && this.nodeIsInPlayerView(t) && XChoreUtil.playSound(i, s)
    }
    nodeIsInPlayerView(e) {
        let i = t.mapMgr.mapPosToStagePos(e.x, e.y);
        return !(i.x < 0 || i.x > Laya.stage.width) && !(i.y < 0 || i.y > Laya.stage.height)
    }
    playSound(t, i, s) {
        t && this.gameStatus == XGameStatus.E_GAME_START && this.isInPlayerView(t) && XChoreUtil.playSound(i, s)
    }
    isInPlayerView(e) {
        return this.nodeIsInPlayerView(e.owner)
    }
    showSpecialTip(e) {
        director.getScheduler().schedule((dt)=>{}, this, 2, 0) {

        }
        Laya.timer.once(2e3, this, () => {
            XToast.show(`${e}个炮台更换了底座`)
        })
    }
    isChooseBuff() {
        let e = !1;
        return t.cfg.buffCfg.foreach(i => {
            if (i.isOpen) {
                let s = t.user.gameInfo.getBuffData(i.id);
                if (i.isRepeat) {
                    if (!s || s.lv < i.values.length - 1) return e = !0, !1
                } else if (!s) return e = !0, !1
            }
        }), e
    }
    getPlayer() {
        let i = [0, 1, 2, 3, 4, 5],
            s = new he;
        s.type = e.PlayerType.E_Defender, s.uuid = fx.Utils.createUUID(), s.name = this.randomName(), s.skinId = t.user.gameInfo.curSkinId;
        let a = [s, null, null, null, null, null],
            n = [];
        for (let s = 0; s < 6; s++) {
            let s = XRandomUtil.getIntRandom(0, i.length - 1);
            if (0 == (s = i.splice(s, 1)[0])) {
                let i = t.user.gameInfo,
                    s = t.cfg.difficultCfg.get(i.curLv);
                t.gameMgr.dCfg = s;
                let a = s.addMaxHp + 1;
                i.curLv == t.cfg.difficultCfg.length && (s = t.cfg.difficultCfg.get(i.maxWinCnt % i.curLv + 1));
                let r = new he;
                r.type = e.PlayerType.E_Hunter, r.uuid = fx.Utils.createUUID(), r.name = this.randomName(), r.skinId = s.bossId, r.attackPower = t.cfg.hunterCfg.attackList[0], r.curHp = t.cfg.hunterCfg.hpList[0] * a, r.maxHp = t.cfg.hunterCfg.hpList[0] * a, n.push(r)
            } else {
                let i = new he;
                i.type = e.PlayerType.E_Defender, i.uuid = fx.Utils.createUUID(), i.name = this.randomName(), i.skinId = fx.Utils.randomInArray(t.cfg.getPlayerIdArr()), a[s] = i
            }
        }
        return [a, n]
    }
    randomName(e = 0) {
        if (!this.playerNames) {
            this.playerNames = [], this.includeName = [];
            let e = fx.CfgMgr.instance.get("namesCfg");
            for (const t in e) this.playerNames.push(e[t].name)
        }
        e++;
        let t = fx.Utils.randomInArray(this.playerNames);
        return e > 10 ? t : this.includeName.includes(t) ? this.randomName(e) : t
    }
    clearRandomName() {
        this.playerNames = null
    }
}