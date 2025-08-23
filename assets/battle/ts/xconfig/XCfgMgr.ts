import { XRandomUtil } from "../xutil/XRandomUtil"
import { XCfgHunterEquipData, XCfgShopData, XCfgSkinData } from "./XCfgData"
import { XSkinType } from "./XEnum"

class BaseDataModel {
    _name: string
    constructor(name_: string) {
        this._name = name_
    }
}

/**load jsons */
export default class XCfgMgr {

    map: BaseDataModel
    skin: XCfgSkinData[] = []

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
    buffCfg: BaseDataModel
    difficultCfg: BaseDataModel
    playerIdArr: number[] = []
    playerSkinTypeArr: number[] = []

    load() {
        this.map = new BaseDataModel("mapCfg")
        // this.skin = new BaseDataModel("skinCfg")
        // this.buildCreate = new BaseDataModel("buildCreateCfg")
        // this.hunterCfg = fx.CfgMgr.instance.get("hunterCfg")
        // this.hunterDifficultCfg = new BaseDataModel("hunterDifficultCfg")
        // this.hunterEquipCfg = new BaseDataModel("hunterEquipCfg")
        // this.sevenGhostCfg = new BaseDataModel("sevenGhostCfg")
        // this.clubReward = new BaseDataModel("clubReward")
        // this.inviteCfg = new BaseDataModel("inviteCfg")
        // this.magicBoxCfg = new BaseDataModel("magicBoxCfg")
        // this.shopCfg = new BaseDataModel("shopCfg_test")
        // this.hunterSkillCfg = new BaseDataModel("hunterSkillCfg_test")
        // this.buffCfg = new BaseDataModel("buffCfg_test")
        // this.difficultCfg = new BaseDataModel("newDifficultCfg")
        // this.playerIdArr = []
        // this.playerSkinTypeArr = []
        this.skin.forEach(t => {
            if (t.type == XSkinType.Human) {
                this.playerIdArr.push(t.id)
                if (t.skinType && this.playerSkinTypeArr.indexOf(t.skinType) == -1)
                    this.playerSkinTypeArr.push(t.skinType)
            }
        })
        // this.magicBoxCfg.foreach(e => { })
    }
    getPlayerIdArr() {
        return this.playerIdArr
    }
    getPlayerSkinTypeArr() {
        return this.playerSkinTypeArr
    }
    getSkinArrByType(e) {
        let t = [];
        return this.skin.forEach(i => {
            i.type == e && t.push(i.id)
        }), t
    }
    getSkinArrBySkinType(e) {
        let t = [];
        return this.skin.forEach(i => {
            i.skinType == e && t.push(i.id)
        }), t
    }
    getRandomHunter() {
        let t = [];
        return this.skin.forEach(i => {
            i.type == XSkinType.Hunter && t.push(i)
        }), XRandomUtil.randomInArray(t)
    }
    getShopGroupArr(e) {
        let t = [];
        return this.shopCfg.forEach(i => {
            i.group == e && t.push(i)
        }), t
    }
    getHunterEquipCfg(e, t) {
        let i;
        return this.hunterEquipCfg.forEach(s => {
            if (s.part == e && s.level == t) return i = s
        }), i
    }
    getHunterSkillArr() {
        let t = [];
        return this.skin.forEach(i => {
            i.type == XSkinType.Hunter && t.push(i)
        }), t
    }
}


