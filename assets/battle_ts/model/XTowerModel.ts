import { XBuffType } from "../xconfig/XEnum";
import XMgr from "../XMgr";
import XBuildingModel from "./XBuildingModel";

export default class XTowerModel extends XBuildingModel {
    atk = 0
    atkCD = 0
    atkDst = 0
    isDizzy = false

    getAtkPow() {
        let bastAtkk = this.atk
        let resultAtk = bastAtkk;
        for (const buff of this.buffs)
            buff.type == XBuffType.ATK_POW && (resultAtk += buff.result(bastAtkk));
        return resultAtk
    }
    getAtkCD() {
        let atkCD = this.atkCD
        let resultCD = atkCD;
        for (const buff of this.buffs)
            buff.type != XBuffType.ATK_SPD && buff.type != XBuffType.DYC_ATK_SPD || (resultCD += buff.result(atkCD));
        if (3e3 == this.id && this.playerUuid == XMgr.playerMgr.mineUuid) {
        }
        return resultCD = Math.max(.2, resultCD)
    }
    getAtkDst() {
        let atkDst = this.atkDst,
            resultDst = atkDst;
        for (const buff of this.buffs)
            buff.type == XBuffType.ATK_DST && (resultDst += buff.result(atkDst));
        return resultDst
    }
}

