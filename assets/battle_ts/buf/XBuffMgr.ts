import XBaseModel from "../model/XBaseModel";
import XPlayerModel from "../model/XPlayerModel";

export class XBuffMgr {
    addBuff(model: XBaseModel, buff) {
        model && buff &&
            (model.buffs = model.buffs || [], model.buffs.indexOf(buff) >= 0 || model.buffs.push(buff))
    }

    removeBuff(model: XBaseModel, buff) {
        if (!(model && model.buffs && model.buffs.length && buff))
            return;
        let i = model.buffs.findIndex(e => e == buff);
        - 1 != i && model.buffs.splice(i, 1)
    }

    getBuff(model, buff) {
        if (!(model && model.buffs && model.buffs.length && buff))
            return null;
        let i = model.buffs.findIndex(e => e == buff);
        return -1 == i ? null : model.buffs[i]
    }
    clearBuffs(model) {
        model && model.buffs && model.buffs.length && (model.buffs = [])
    }
}


