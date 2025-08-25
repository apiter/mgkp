import { assetManager, JsonAsset, log } from "cc"
import { XRandomUtil } from "../xutil/XRandomUtil"
import { XCfgHunterEquipData, XCfgMapCfgItem, XCfgShopData, XCfgSkinData, XDifficultCfgItem as XCfgDifficultyItem, XCfgBuffItem, XCfgMapDataItem } from "./XCfgData"
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
    mapDatas: Map<string, Map<string, XCfgMapDataItem>> = new Map()
    skin: Map<string, XCfgSkinData>
    difficultCfg: Map<string, XCfgDifficultyItem>
    buffCfg: Map<string, XCfgBuffItem>

    buildCreate: BaseDataModel
    constant
    hunterCfg
    hunterDifficultCfg: BaseDataModel
    hunterEquipCfg: XCfgHunterEquipData[] = []
    sevenGhostCfg: BaseDataModel
    clubReward: BaseDataModel
    inviteCfg: BaseDataModel
    magicBoxCfg: BaseDataModel
    shopCfg: XCfgShopData[] = []
    hunterSkillCfg: BaseDataModel
    playerIdArr: number[] = []
    playerSkinTypeArr: number[] = []

    allCfgMap = new Map<string, Map<string, any>>()

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

                    this.mapCfg = this.allCfgMap.get("mapCfg")
                    this.difficultCfg = this.allCfgMap.get("difficultCfg")
                    this.skin = XUtil.objectToMap<string, XCfgSkinData>(this.allCfgMap.get("skinCfg"))
                    this.buffCfg = this.allCfgMap.get("buffCfg_test")


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
                        const data = XUtil.objectToMap<string, XCfgMapDataItem>(jsonEle.json)
                        this.mapDatas.set(element.name, data)
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


