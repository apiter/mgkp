import { assetManager, JsonAsset, log } from "cc"
import { XRandomUtil } from "../xutil/XRandomUtil"
import { XCfgHunterEquipData, XCfgMapCfgItem, XCfgShopData, XCfgSkinData, XDifficultCfgItem as XCfgDifficultyItem, XCfgBuffItem, XCfgMapData, XDifficultCfgItem, XCfgHunterData, XCfgSpecialTowerData, XCfgSuperBuildingData, XConstant, XCfgMagicBoxData } from "./XCfgData"
import { XSkinType } from "./XEnum"
import XUtil from "../xutil/XUtil"

class BaseDataModel {
    _name: string
    constructor(name_: string) {
        this._name = name_
    }
}

/**load jsons */
export default class XCfgMgr {

    mapCfg: Map<string, XCfgMapCfgItem>
    mapDatas: Map<string, XCfgMapData> = new Map()
    skin: Map<string, XCfgSkinData>
    difficultCfg: Map<string, XCfgDifficultyItem>
    hunterDifficultCfg: Map<string, XCfgDifficultyItem>
    buffCfg: Map<string, XCfgBuffItem>
    specialTowerCfg:Map<string, XCfgSpecialTowerData>
    superBuildCfg:Map<string, XCfgSuperBuildingData>

    buildCreate: BaseDataModel
    constant:XConstant
    hunterCfg:XCfgHunterData
    hunterEquipCfg: XCfgHunterEquipData[] = []
    sevenGhostCfg: BaseDataModel
    clubReward: BaseDataModel
    inviteCfg: BaseDataModel
    magicBoxCfg: Map<string, XCfgMagicBoxData>
    shopCfg: XCfgShopData[] = []
    hunterSkillCfg: BaseDataModel
    playerIdArr: number[] = []
    playerSkinTypeArr: number[] = []

    allCfgMap = new Map<string, any>()

    async load(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.loadJsonData()
            log(`XCfgMgr loadJsonData complete`)
            await this.loadMapData()
            log(`XCfgMgr loadMapData complete`)
            resolve()
        })
    }

    loadJsonData(): Promise<void> {
        return new Promise((resolve) => {
            assetManager.loadBundle("battle", (err, bundle) => {
                if (err) {
                    console.error(err);
                    resolve()
                    return;
                }
                bundle.loadDir("cfg", (err, assets) => {
                    if (err) {
                        console.error(err);
                        resolve()
                        return;
                    }
                    assets.forEach(element => {
                        const jsonEle = element as JsonAsset
                        jsonEle.json && this.allCfgMap.set(element.name, jsonEle.json as Map<string, any>)
                    });

                    this.mapCfg = XUtil.objectToMap<string, XCfgMapCfgItem>(this.allCfgMap.get("mapCfg"))
                    this.difficultCfg = XUtil.objectToMap<string, XDifficultCfgItem>(this.allCfgMap.get("newDifficultCfg")) 
                    this.hunterDifficultCfg = XUtil.objectToMap<string, XDifficultCfgItem>(this.allCfgMap.get("hunterDifficultCfg")) 
                    this.skin = XUtil.objectToMap<string, XCfgSkinData>(this.allCfgMap.get("skinCfg"))
                    this.buffCfg = XUtil.objectToMap<string, XCfgBuffItem>(this.allCfgMap.get("buffCfg_test"))
                    this.magicBoxCfg = XUtil.objectToMap<string, XCfgMagicBoxData>(this.allCfgMap.get("magicBoxCfg"))
                    this.hunterCfg = this.allCfgMap.get("hunterCfg") as XCfgHunterData
                    this.specialTowerCfg = XUtil.objectToMap<string, XCfgSpecialTowerData>(this.allCfgMap.get("specialTowerCfg_test"))
                    this.superBuildCfg = XUtil.objectToMap<string, XCfgSuperBuildingData>(this.allCfgMap.get("superBuildCfg_test"))
                    this.constant = this.allCfgMap.get("constant") as XConstant


                    this.skin.forEach((v, k) => {
                        if (v.type == XSkinType.Human) {
                            this.playerIdArr.push(v.id)
                            if (v.skinType && this.playerSkinTypeArr.indexOf(v.skinType) == -1)
                                this.playerSkinTypeArr.push(v.skinType)
                        }
                    })
                    resolve()
                })
            })
        })
    }

    loadMapData(): Promise<void> {
        return new Promise((resolve) => {
            assetManager.loadBundle("battle", (err, bundle) => {
                if (err) {
                    console.error(err);
                    resolve()
                    return;
                }
                bundle.loadDir("map", (err, assets) => {
                    if (err) {
                        console.error(err);
                        resolve()
                        return;
                    }
                    assets.forEach(element => {
                        const jsonEle = element as JsonAsset
                        // const data = XUtil.objectToMap<string, XCfgMapData>(jsonEle.json)
                        this.mapDatas.set(element.name, jsonEle.json as XCfgMapData)
                    });
                    resolve()
                })
            })
        })
    }

    getPlayerIdArr() {
        return this.playerIdArr
    }
    getPlayerSkinTypeArr() {
        return this.playerSkinTypeArr
    }
    getSkinArrByType(e) {
        let t = [];
        return this.skin.forEach((v) => {
            v.type == e && t.push(v.id)
        }), t
    }
    getSkinArrBySkinType(e) {
        let t = [];
        return this.skin.forEach(v => {
            v.skinType == e && t.push(v.id)
        }), t
    }
    getRandomHunter() {
        let t = [];
        return this.skin.forEach(v => {
            v.type == XSkinType.Hunter && t.push(v)
        }), XRandomUtil.randomInArray(t)
    }
    getShopGroupArr(group_: number) {
        let t = [];
        return this.shopCfg.forEach(v => {
            v.group == group_ && t.push(v)
        }), t
    }
    getHunterEquipCfg(part_, level_) {
        let i;
        // this.hunterEquipCfg.forEach(s => {
        //     if (s.part == part_ && s.level == level_) return i = s
        // })
        return i
    }
    getHunterSkillArr() {
        let ret = [];
        this.skin.forEach(v => {
            v.type == XSkinType.Hunter && ret.push(v)
        })
        return ret
    }
}


