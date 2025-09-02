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
    isGoldlessMode = false;
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
    changePlayerIncomeByUuid(uuid_, coin_, energy_) {
        if (!uuid_) return;
        let player = this.getPlayer(uuid_);
        if (!player) return false;
        if (this.isGoldlessMode && uuid_ == this.mineUuid) return true;
        coin_ = coin_ || 0, energy_ = energy_ || 0;
        let coin = Math.max(player.coin + coin_, 0).toFixed(1)
        let energy = Math.max(player.energy + energy_, 0).toFixed(1);
        player.coin = Number(coin)
        player.energy = Number(energy)
        return true
    }

    isPlayerBed(uuid_) {
        if (!this.player) return false;
        if (!uuid_) return this.player.isBed;
        for (const defender of this.defenders)
            if (defender.uuid == uuid_)
                return defender.isBed
        return false
    }
    get mineRoomId() {
        return this.player.roomId
    }
    addFighter(fighter_: XPlayerModel) {
        fighter_.spwanPoint = XRandomUtil.getIntRandom(0, XMgr.gameMgr.mapCfg.hunterPointNum - 1)
        this.hunters.push(fighter_)
        EventCenter.emit(XEventNames.E_Create_Fighter, fighter_)
        this.fighter = fighter_
    }
    addBoxMonster(boxMonster: XPlayerModel, i) {
        boxMonster.spwanPoint = XRandomUtil.getIntRandom(0, XMgr.gameMgr.mapCfg.hunterPointNum - 1)
        this.hunters.push(boxMonster)
        EventCenter.emit(XEventNames.E_Create_BoxMonster, boxMonster, i)
    }
    addGhost(ghost_: XPlayerModel) {
        ghost_.spwanPoint = XRandomUtil.getIntRandom(0, XMgr.gameMgr.mapCfg.hunterPointNum - 1)
        this.hunters.push(ghost_)
        EventCenter.emit(XEventNames.E_Create_Ghost, ghost_)
    }
    addAngel() {
        let angel = new XPlayerModel;
        angel.uuid = this.mineUuid
        angel.name = this.player.name
        angel.type = XPlayerType.E_Defender
        angel.isAngel = true
        angel.skinId = 90003
        angel.spwanPoint = XRandomUtil.getIntRandom(0, XMgr.gameMgr.mapCfg.defenderPointNum - 1)
        this.angels.push(angel)
        EventCenter.emit(XEventNames.E_Create_Angel, angel)
    }
    deleteGhost() {
        let hunters = this.hunters.splice(1);
        for (const hun of hunters)
            hun && hun.owner && hun.owner.isValid && (hun.ownerScript.onDead(), hun.owner.destroy())
    }
}