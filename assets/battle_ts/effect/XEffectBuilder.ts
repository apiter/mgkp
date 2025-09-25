import XBuildingModel from "../model/XBuildingModel"
import { XCfgEffectData } from "../xconfig/XCfgData"
import { XEffectType } from "../xconfig/XEnum"
import { XCoinAndEnergyEffect } from "./XCoinAndEnergyEffect"
import { XCoinEffect } from "./XCoinEffect"
import { XDoorAlwaysAddHp } from "./XDoorAlwaysAddHp"
import { XDoorGetCoinOnHurt } from "./XDoorGetCoinOnHurt"
import { XEnemySlowAtkSpd } from "./XEnemySlowAtkSpd"
import { XEnergyEffect } from "./XEnergyEffect"
import { XTowerAddAtkDst } from "./XTowerAddAtkDst"

export class XEffectBuilder {
    static effectMap: { [key: string]: any } = null
    private static init() {
        XEffectBuilder.effectMap = {
            [XEffectType.Add_Coin]: XCoinEffect,
            [XEffectType.Add_Energy]: XEnergyEffect,
            [XEffectType.Add_CoinAndEnergy]: XCoinAndEnergyEffect,
            [XEffectType.Door_AlwaysAddHp]:XDoorAlwaysAddHp,
            [XEffectType.Enemy_SlowAtkSpd]:XEnemySlowAtkSpd,
            [XEffectType.Door_GetCoinOnHurt]:XDoorGetCoinOnHurt,
            [XEffectType.Tower_AddAtkDst]:XTowerAddAtkDst
        }
    }

    static createEffect(effectCfg: XCfgEffectData, buildModel: XBuildingModel) {
        this.effectMap || this.init();
        let effectCls = this.effectMap[effectCfg.type];
        return effectCls && new effectCls(effectCfg, buildModel)
    }
}


