import XGameInfo from "../model/XGameInfo";
import XUserInfo from "../model/XUserInfo";

export default class XUser {
    localVersion = 0;
    changeAccount = !1;
    _isUploading = !1;
    _uploadDirty = !1;
    infoMap = new Map<string, any>();
    userInfo = null;
    gameInfo = null;
    commonInfo = null;
    navigateInfo = null;

    constructor() {
        let t = localStorage.getItem("localVersion");
        if (t) {
            let e = Number(t);
            isNaN(e) || (this.localVersion = e)
        }
        this.userInfo = new XUserInfo
        this.gameInfo = new XGameInfo
        //TODO
    }
    reg<T extends { Key: string }>(e: new () => T): T {
        let t = new e;
        return this.infoMap.has(t.Key) && console.error("重复的key"), this.infoMap.set(t.Key, t), t
    }
    getStoreInfos() {
        let e = [];
        return this.infoMap.forEach(t => {
            e.push(t)
        }), e
    }
    init() {
        let e = this.userInfo.checkDailyReset(),
            t = this.userInfo.checkWeeklyReset(),
            i = this.getStoreInfos();
        for (const s of i) s.init(e, t);
        for (const e of i) e.onLateInit();
        //TODO
    }
    clear() {
        let e = this.getStoreInfos();
        for (const t of e) t.clear()
    }
    parseFromLocal() {
        let e = this.getStoreInfos();
        for (const t of e) t.parseFromLocal()
    }
    saveToLocal() {
        if (this.changeAccount) return;
        let e = this.getStoreInfos();
        for (const t of e) t.saveToLocal()
    }
    addLocalVersion() {
        this.localVersion++, this.saveLocalVersion()
    }
    getLocalVersion() {
        return this.localVersion
    }
    saveLocalVersion() {
        //TODO
    }
    saveToServer() {
        //TODO
    }
    saveToServerForce() {
        //TODO
    }
}