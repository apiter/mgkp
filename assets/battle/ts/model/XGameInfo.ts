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
        XMgr.cfg.shopCfg.forEach(e => {
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
    }
    useBuildData(e, i = 1) {
    }
    clearOwnSkin() {
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
    }

    getSkinCnt() {
        let e = 0;
        for (const [t, i] of this.ownSkin) i.isUnlock && e++;
        return e
    }

    clearOwnSkinFragment() {
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
    }

    useSkinFragmentData(e, t, i = 0) {
    }

    clearSkinTypeShow() {
    }

    getSkinTypeShow(e) {
        if (this.skinTypeShow.has(e)) {
            return this.skinTypeShow.get(e).id
        }
        return 0
    }
    setSkinTypeShow(e, i) {
    }
    clearOwnPrize() {
    }
    addOwnPrizeData(e, t = 1) {
        
    }
    usePrizeData(e, i = 1) {
    }
    clearOwnBuff() {
    }
    addBuff(e) {
    }
    getBuffData(e) {
    }
    clearOwnHunterSkin() {
    }
    isUnlockHunterSkin(e) {
    }
    unlockHunterSkin(e) {
    }
    updateGameClubData() {
    }
    getClubValue(t) {
    }

    isClubRewardClaimed(e) {
    }
    claimClubReward(e) {
       
    }
    clearShowHunterSkillDes() {
    }
    addShowHunterSkillDes(e) {
    }
    getShowHunterSkillDes(e) {
    }

    onPropertyChange(prop: string) {

    }
}


