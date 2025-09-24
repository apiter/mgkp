import XBuildingModel from "../model/XBuildingModel"
import { XCfgEffectData } from "../xconfig/XCfgData"
import { XEffectType } from "../xconfig/XEnum"
import { XCoinAndEnergyEffect } from "./XCoinAndEnergyEffect"
import { XCoinEffect } from "./XCoinEffect"
import { XDoorAlwaysAddHp } from "./XDoorAlwaysAddHp"
import { XEnemySlowAtkSpd } from "./XEnemySlowAtkSpd"
import { XEnergyEffect } from "./XEnergyEffect"

export class XEffectBuilder {
    static effectMap: { [key: string]: any } = null
    private static init() {
        XEffectBuilder.effectMap = {
            [XEffectType.Add_Coin]: XCoinEffect,
            [XEffectType.Add_Energy]: XEnergyEffect,
            [XEffectType.Add_CoinAndEnergy]: XCoinAndEnergyEffect,
            [XEffectType.Door_AlwaysAddHp]:XDoorAlwaysAddHp,
            [XEffectType.Enemy_SlowAtkSpd]:XEnemySlowAtkSpd
        }
    }

    static createEffect(effectCfg: XCfgEffectData, buildModel: XBuildingModel) {
        this.effectMap || this.init();
        let effectCls = this.effectMap[effectCfg.type];
        return effectCls && new effectCls(effectCfg, buildModel)
    }
}


