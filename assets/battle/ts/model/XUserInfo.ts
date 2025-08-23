import XMgr from "../XMgr";
import { moment } from "../xutil/XMoment";

export default class XUserInfo {
    useLocalTime = false;
    loginTime = 0;
    loginDay = 1;
    todayLoginCnt = 0;
    cityId = 0;
    createTime = 0;
    profileRejected = false;
    name = "";
    avatarUrl = "";
    dailyResetTime = null;
    weeklyResetTime = null;

    get day() {
        if (0 == this.createTime) return -1;
        let e = Math.max(XMgr.gameTime.getTime() - this.createTime, 0);
        return Math.floor(e / 864e5) + 1
    }
    clear() {
        this.cityId = 0
    }
    init(e, t) {
        this.todayLoginCnt++
    }
    onNewDay() {
        this.loginDay++, this.todayLoginCnt = 1
    }
    checkDailyReset() {
        return false
    }
    checkWeeklyReset() {
        return false
    }
    getDailyResetTime() {
        return moment(this.dailyResetTime)
    }
    getWeeklyResetTime() {
        return moment(this.weeklyResetTime)
    }
    getUserProfile() {
        return new Promise((e, t) => {
            let i = localStorage.getItem("nickName"),
                s = localStorage.getItem("avatarUrl");
            e({
                nickName: i,
                avatarUrl: s || ""
            })
        })
    }
}


