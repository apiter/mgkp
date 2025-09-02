import { XBuffType } from "../xconfig/XEnum";
import XMgr from "../XMgr";
import XBuildingModel from "./XBuildingModel";

export default class XTowerModel extends XBuildingModel {
    atk = 0
    atkCD = 0
    atkDst = 0

    getAtkPow() {
        let e = this.atk,
            t = e;
        for (const i of this.buffs) i.Type == XBuffType.ATK_POW && (t += i.result(e));
        return t
    }
    getAtkCD() {
        let e = this.atkCD,
            i = e;
        for (const t of this.buffs) t.Type != XBuffType.ATK_SPD && t.Type != XBuffType.DYC_ATK_SPD || (i += t.result(e));
        if (3e3 == this.id && this.playerUuid == XMgr.playerMgr.mineUuid) {
            // let e = XMgr.user.gameInfo.getBuffData(23);
            // if (e) {
            //     i *= (100 - XMgr.cfg.buffCfg.get("23").values[e.lv]) / 100
            // }
        }
        return i = Math.max(.2, i)
    }
    getAtkDst() {
        let e = this.atkDst,
            t = e;
        for (const i of this.buffs) i.Type == XBuffType.ATK_DST && (t += i.result(e));
        return t
    }
}

