import XMgr from "../XMgr";
import XUtil from "../xutil/XUtil";
import { XBuildData } from "./XBuildData";

export default class XGameInfo {
    coin = 0;
    tian = 0;
    vibrateEnable = true;
    showSkinRed = true;
    dailyShare = false;
    dailyBuyZr = false;
    isUnlockAngelOrGhost = false;
    isUnlockHunter = false;
    isUnlockSevenGhost = false;
    isGetTian = false;
    inviteCnt = 0;
    inviteClaimed = 0;
    _clubDataList = [];
    tempCoin = 0;
    curSkinId = 1001;
    curHunterSkinId = 10001;
    maxLevel = 1;
    winCnt = 0;
    failCnt = 0;
    isStartLv = false;
    weekMaxLv = 1;
    curLv = 1;
    lastLv = 1;
    lowestLv = 1;
    todayMaxLv = 0;
    todayExtraScore = 0;
    isLastWin = false;
    isMapByWeek = false;
    maxWinCnt = 0;
    isUseSkinFragmentVideo = false;
    getFragmentCnt = 0;
    mapBuildRate = 0;
    taskIndex = 1;
    isExitGame = false;
    magicGetCnt = 0;
    isFirstBuild = true;
    dailyShareCnt = 0;
    canPlayTurnTable = true;
    showTurntableCnt = 0;
    playHunter = false;
    curHunterLv = 1;
    lastHunterLv = 1;
    lowestHunterLv = 1;
    todayHunterMaxLv = 0;
    todayHunterExtraScore = 0;
    isLastHunterWin = false;
    maxHunterLevel = 1;
    hunterBox = 3;
    hunterUnlockLvl = 0;
    curSevenGhostLv = 1;
    isEvaluate = false;
    isOpenEvaluate = false;
    isOpenNewSkin = false;
    isCommond = false;
    isOpenCommond = false;
    clubClaimedList = [];
    ownBuild: Map<number, { cnt: number }> = new Map();
    ownSkin: Map<number, { cnt: number, isUnlock: boolean }> = new Map();
    ownSkinFragment: Map<number, { cnt: number, cnt_1: number }> = new Map();
    skinTypeShow: Map<number, { id: number }> = new Map();

    constructor() {
        this.clear()
    }
    clear() {
        this.coin = 0, this.tian = 0, this.tempCoin = 0, this.curSkinId = 1001, this.curHunterSkinId = 10001, this.maxLevel = 1,
            this.winCnt = 0, this.failCnt = 0, this.isStartLv = !1, this.weekMaxLv = 1,
            this.curLv = 1, this.lastLv = 1, this.lowestLv = 1, this.todayMaxLv = 0, this.todayExtraScore = 0,
            this.isLastWin = !1, this.isMapByWeek = !1, this.maxWinCnt = 0, this.isUseSkinFragmentVideo = !1, this.getFragmentCnt = 0,
            this.mapBuildRate = 0, this.taskIndex = 1, this.isExitGame = !1, this.magicGetCnt = 0, this.isFirstBuild = !0, this.dailyShareCnt = 0,
            this.canPlayTurnTable = !0, this.showTurntableCnt = 0, this.dailyShare = !1, this.dailyBuyZr = !1, this.playHunter = !1, this.curHunterLv = 1,
            this.lastHunterLv = 1, this.lowestHunterLv = 1, this.todayHunterMaxLv = 0, this.todayHunterExtraScore = 0, this.isLastHunterWin = !1,
            this.maxHunterLevel = 1, this.hunterBox = 3, this.hunterUnlockLvl = 0, this.curSevenGhostLv = 1, this.isUnlockSevenGhost = !1,
            this.isUnlockAngelOrGhost = !1, this.isUnlockHunter = !1, this.isGetTian = !1, this.clubClaimedList = [], this.isEvaluate = !1,
            this.isOpenEvaluate = !1, this.inviteCnt = 0, this.inviteClaimed = 0, this.isOpenNewSkin = !1, this.isCommond = !1, this.isOpenCommond = !1,
            this.clearOwnBuild(), this.clearOwnSkin(), this.clearOwnSkinFragment(), this.clearSkinTypeShow(), this.clearOwnPrize(), this.clearOwnBuff(),
            this.clearOwnHunterSkin(), this.clearShowHunterSkillDes()
    }
    init(e) {
        this.tempCoin > 0 && (this.coin += this.tempCoin)
    }
    onNewDay() {
        this.isStartLv = !0, this.curLv = 1, this.lastLv = 1, this.lowestLv = 1,
            this.todayMaxLv = 0, this.isLastWin = !1, this.isMapByWeek = !1, this.maxWinCnt = 0,
            this.dailyShareCnt = 0, this.canPlayTurnTable = !0, this.dailyShare = !1, this.dailyBuyZr = !1,
            this.playHunter = !1, this.curHunterLv = 1, this.lastHunterLv = 1, this.lowestHunterLv = 1,
            this.todayHunterMaxLv = 0, this.isLastHunterWin = !1, this.hunterUnlockLvl = 0, this.isGetTian = !1,
            this.clearOwnBuff(), this.todayExtraScore = 0, this.todayHunterExtraScore = 0, this.isUseSkinFragmentVideo = !1,
            this.isExitGame = !1, this.magicGetCnt = 0, this.showSkinRed = !0, this.isOpenCommond = !1;
        let e = [];
        this.isClubRewardClaimed(1) && e.push(1), this.clubClaimedList = e
    }
    coinEnough(e) {
        return this.coin >= e
    }
    useCoin(e, i) {
        if (!XUtil.isNumber(e)) return;
        if (!i && !this.coinEnough(e)) return !1;
        let s = Math.max(this.coin - e, 0);
        return this.coin = s, true
    }
    addCoin(e) {
        XUtil.isNumber(e) && (this.coin += e)
    }
    addTempCoin(e, i = !0) {
        XUtil.isNumber(e) && (this.tempCoin += e)
    }
    subTempCoin(e) {
        let t = this.tempCoin - e;
        t = Math.max(t, 0), this.tempCoin = t, this.addCoin(e)
    }
    tianEnough(e) {
        return this.tian >= e
    }
    useTian(e, i) {
        if (!XUtil.isNumber(e)) return;
        if (!i && !this.coinEnough(e)) return !1;
        let s = Math.max(this.tian - e, 0);
        return this.tian = s, !0
    }
    addTian(e) {
        XUtil.isNumber(e) && (this.tian += e)
    }
    setCurLv(e) {
        this.curLv = e, e - this.lowestLv > 1 && (this.lowestLv = e - 1)
    }
    setCurHunterLv(e) {
        this.curHunterLv = e, e - this.lowestHunterLv > 1 && (this.lowestHunterLv = e - 1)
    }
    clearOwnBuild() {
        this.ownBuild = new Map
        XMgr.cfg.shopCfg.foreach(e => {
            let t = new XBuildData;
            t.cnt = e.initialHave, this.ownBuild.set(e.buildId, t)
        })
        this.onPropertyChange("ownBuild")
    }
    getOwnBuildCnt(e) {
        if (this.ownBuild.has(e)) {
            let t = this.ownBuild.get(e);
            return t.cnt < 0 ? (t.cnt = 0, this.ownBuild.set(e, t), this.onPropertyChange("ownBuild"), 0) : t.cnt
        }
        return 0
    }
    addOwnBuildData(e, t, i) {
        6666 == e && (i = 20);
        let s = this.ownBuild.get(e);
        this.ownBuild.has(e) || (s = new ba), s.cnt += t, i && (s.cnt = Math.min(s.cnt, i)), this.ownBuild.set(e, s), this.onPropertyChange("ownBuild")
    }
    useBuildData(e, i = 1) {
        let s = this.ownBuild.get(e);
        this.ownBuild.has(e) ? (s.cnt -= i, this.ownBuild.set(e, s), this.onPropertyChange("ownBuild")) : s = new ba
    }
    clearOwnSkin() {
        this.ownSkin = new Map, t.cfg.skin.foreach(t => {
            let i = new wa;
            i.cnt = 0, i.isUnlock = !1, t.unlock && 999 == t.unlock.way && t.type == e.SkinType.Human && (i.isUnlock = !0), this.ownSkin.set(t.id, i)
        }), this.onPropertyChange("ownSkin")
    }
    isUnlockSkin(e) {
        if (this.ownSkin.has(e)) {
            return this.ownSkin.get(e).isUnlock
        }
        return null
    }
    getSkinData(e) {
        if (this.ownSkin.has(e)) {
            return this.ownSkin.get(e)
        }
        return null
    }
    unlockSkin(e) {
        let i;
        this.ownSkin.has(e) ? i = this.ownSkin.get(e) : (i = new wa).cnt = 0, i.isUnlock = !0;
        let s = t.cfg.skin.get(e);
        s && XAnalyticsUtil.getSkin(s.name), this.onPropertyChange("ownSkin")
    }
    getSkinCnt() {
        let e = 0;
        for (const [t, i] of this.ownSkin) i.isUnlock && e++;
        return e
    }
    clearOwnSkinFragment() {
        this.ownSkinFragment = new Map, t.cfg.skin.foreach(e => {
            if (!this.ownSkinFragment.has(e.skinType)) {
                let t = new Sa;
                t.cnt = 0, t.cnt_1 = 0, this.ownSkinFragment.set(e.skinType, t)
            }
        }), this.onPropertyChange("ownSkinFragment")
    }
    getOwnSkinFragmentCnt(e, t = 0) {
        if (!this.ownSkinFragment.has(e)) return 0; {
            let i = this.ownSkinFragment.get(e);
            switch (t) {
                case 0:
                    return i.cnt;
                case 1:
                    return i.cnt_1 || (i.cnt_1 = 0), i.cnt_1;
                default:
                    return i.cnt
            }
        }
    }
    addOwnSkinFragmentData(e, t, i = 0) {
        let s = this.ownSkinFragment.get(e);
        switch (this.ownSkinFragment.has(e) || (s = new Sa), i) {
            case 0:
                s.cnt += t;
                break;
            case 1:
                s.cnt_1 || (s.cnt_1 = 0), s.cnt_1 += t;
                break;
            default:
                s.cnt += t
        }
        this.ownSkinFragment.set(e, s), this.onPropertyChange("ownSkinFragment")
    }
    useSkinFragmentData(e, t, i = 0) {
        let s = this.ownSkinFragment.get(e);
        switch (this.ownSkinFragment.has(e) || (s = new Sa), i) {
            case 0:
                s.cnt -= t;
                break;
            case 1:
                s.cnt_1 || (s.cnt_1 = 0), s.cnt_1 -= t;
                break;
            default:
                s.cnt -= t
        }
        this.ownSkinFragment.set(e, s), this.onPropertyChange("ownSkinFragment")
    }
    clearSkinTypeShow() {
        this.skinTypeShow = new Map, t.cfg.skin.foreach(e => {
            if (!this.skinTypeShow.has(e.skinType)) {
                let t = new Ia;
                t.id = e.id, this.skinTypeShow.set(e.skinType, t)
            }
        }), this.onPropertyChange("ownSkinTypeShow")
    }
    getSkinTypeShow(e) {
        if (this.skinTypeShow.has(e)) {
            return this.skinTypeShow.get(e).id
        }
        return 0
    }
    setSkinTypeShow(e, i) {
        if (this.skinTypeShow.has(i)) {
            this.skinTypeShow.get(i).id = e
        } else {
            let t = new Ia;
            t.id = e, this.skinTypeShow.set(i, t)
        }
        this.onPropertyChange("ownSkinTypeShow"), t.user.saveToServer()
    }
    clearOwnPrize() {
        this.ownPrize = new Map, this.onPropertyChange("ownPrize")
    }
    addOwnPrizeData(e, t = 1) {
        let i = this.ownPrize.get(e);
        this.ownPrize.has(e) || ((i = new ba).cnt = 0), i.cnt += t, this.ownPrize.set(e, i), this.onPropertyChange("ownPrize")
    }
    usePrizeData(e, i = 1) {
        let s = this.ownPrize.get(e);
        this.ownPrize.has(e) || (s = new ba), s.cnt -= i, 0 == s.cnt ? this.ownPrize.delete(e) : this.ownPrize.set(e, s), this.onPropertyChange("ownPrize"), t.user.saveToServer()
    }
    clearOwnBuff() {
        this.ownBuff = new Map, this.buffLvArr = [], this.onPropertyChange("ownBuff")
    }
    addBuff(e) {
        let i = this.ownBuff.get(e);
        i ? i.lv += 1 : (i = new va).lv = 0;
        let s = t.cfg.buffCfg.get(e);
        XAnalyticsUtil.buffGet(s.name, i.lv), this.ownBuff.set(e, i), this.onPropertyChange("ownBuff")
    }
    getBuffData(e) {
        return this.ownBuff.get(e)
    }
    clearOwnHunterSkin() {
        this.ownHunterSkin = new Map, t.cfg.skin.foreach(t => {
            let i = new wa;
            i.cnt = 0, i.isUnlock = !1, t.unlock && 999 == t.unlock.way && t.type == e.SkinType.Hunter && (i.isUnlock = !0), this.ownHunterSkin.set(t.id, i)
        }), this.onPropertyChange("ownHunterSkin")
    }
    isUnlockHunterSkin(e) {
        if (this.ownHunterSkin.has(e)) {
            return this.ownHunterSkin.get(e).isUnlock
        }
        return null
    }
    unlockHunterSkin(e) {
        let t;
        this.ownHunterSkin.has(e) ? t = this.ownHunterSkin.get(e) : (t = new wa).cnt = 0, t.isUnlock = !0, this.onPropertyChange("ownHunterSkin")
    }
    updateGameClubData() {
        let e = [];
        t.cfg.clubReward.getList().forEach(t => {
            e.includes(t.clubDataType) || e.push(t.clubDataType)
        }), j.I.getGameClubData(e, e => {
            this._clubDataList = e || [], this.event(Ce.GameClubDataChange)
        })
    }
    getClubValue(t) {
        for (const i of this._clubDataList)
            if (i.dataType == t) return t == e.GameClubDataType.JoinClubTime ? i.value > 0 ? 1 : 0 : i.value;
        return 0
    }
    isClubRewardClaimed(e) {
        return this.clubClaimedList.includes(e)
    }
    claimClubReward(e) {
        let i = this.clubClaimedList.slice();
        for (const s of e)
            if (!i.includes(s)) {
                i.push(s);
                let e = t.cfg.clubReward.get(s);
                t.rewardMgr.addReward(e.reward), XAnalyticsUtil.clubReward(e.clubDataType)
            }
        this.clubClaimedList = i, t.user.saveToServer(), this.event(Ce.GameClubRewardClaimed)
    }
    clearShowHunterSkillDes() {
        this.showHunterSkillDes = new Map, this.onPropertyChange("showHunterDes")
    }
    addShowHunterSkillDes(e) {
        let t = new ka;
        t.b = !0, this.showHunterSkillDes.set(e, t), this.onPropertyChange("showHunterDes")
    }
    getShowHunterSkillDes(e) {
        return this.showHunterSkillDes.get(e)
    }

    onPropertyChange(prop: string) {

    }
}


