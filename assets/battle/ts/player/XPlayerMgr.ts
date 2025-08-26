import EventCenter from "../event/EventCenter";
import { XEventNames } from "../event/XEventNames";
import XMatchData from "../model/XMatchData";
import XPlayerModel from "../model/XPlayerModel";
import { XPlayerType } from "../xconfig/XEnum";
import XMgr from "../XMgr";
import { XRandomUtil } from "../xutil/XRandomUtil";

export default class XPlayerMgr {
    mineUuid = "";
    hunters: XPlayerModel[] = [];
    defenders: XPlayerModel[] = [];
    angels = [];
    players = [];
    playerMap: { [key: string]: XPlayerModel } = {};
    player = null;
    isGoldlessMode = !1;
    fighter = null;

    init(matchData_: XMatchData) {
        this.mineUuid = matchData_.mineUuid
        this.hunters = matchData_.hunters
        this.defenders = matchData_.defenders
        this.angels = []
        this.players = this.hunters.concat(this.defenders)
        this.playerMap = {};
        for (const player of this.players) {
            player.uuid == this.mineUuid && (this.player = player)
            this.playerMap[player.uuid] = player
        }

    }
    getPlayer(id_: string) {
        return id_ ? this.playerMap[id_] : null
    }
    changePlayerIncomeByUuid(e, t, i) {
        if (!e) return;
        let s = this.getPlayer(e);
        if (!s) return !1;
        if (this.isGoldlessMode && e == this.mineUuid) return !0;
        t = t || 0, i = i || 0;
        let a = Math.max(s.coin + t, 0).toFixed(1),
            n = Math.max(s.energy + i, 0).toFixed(1);
        return s.coin = Number(a), s.energy = Number(n), !0
    }
    isPlayerBed(e) {
        if (!this.player) return !1;
        if (!e) return this.player.isBed;
        for (const t of this.defenders)
            if (t.uuid == e) return t.isBed
    }
    get mineRoomId() {
        return this.player.roomId
    }
    addFighter(e) {
        e.spwanPoint = XRandomUtil.getIntRandom(0, XMgr.gameMgr.mapCfg.hunterPointNum - 1)
        this.hunters.push(e)
        EventCenter.emit(XEventNames.E_Create_Fighter, e)
        this.fighter = e
    }
    addBoxMonster(e, i) {
        e.spwanPoint = XRandomUtil.getIntRandom(0, XMgr.gameMgr.mapCfg.hunterPointNum - 1),
            this.hunters.push(e)
        EventCenter.emit(XEventNames.E_Create_BoxMonster, [e, i])
    }
    addGhost(e) {
        e.spwanPoint = XRandomUtil.getIntRandom(0, XMgr.gameMgr.mapCfg.hunterPointNum - 1)
        this.hunters.push(e)
        EventCenter.emit(XEventNames.E_Create_Ghost, e)
    }
    addAngel() {
        let i = new XPlayerModel;
        i.uuid = this.mineUuid,
            i.name = this.player.name,
            i.type = XPlayerType.E_Defender,
            i.isAngel = true,
            i.skinId = 90003,
            i.spwanPoint = XRandomUtil.getIntRandom(0, XMgr.gameMgr.mapCfg.defenderPointNum - 1),
            this.angels.push(i),
            EventCenter.emit(XEventNames.E_Create_Angel, i)
    }
    deleteGhost() {
        let hunters = this.hunters.splice(1);
        for (const hun of hunters) 
            hun && hun.owner && hun.owner.isValid && (hun.ownerScript.onDead(), hun.owner.destroy())
    }
}