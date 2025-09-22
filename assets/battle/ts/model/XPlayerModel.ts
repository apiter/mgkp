import { Node } from "cc"
import { XPlayerScript } from "../view/player/XPlayerScript"
import { XBuffType, XPlayerType } from "../xconfig/XEnum"
import XBaseModel from "./XBaseModel"
import XBuildingModel from "./XBuildingModel"

export default class XPlayerModel extends XBaseModel {
    isOutDoor = true
    isBed = false
    isRage = false
    coin = 0
    energy = 0
    buildings = []
    canBedRange = 116
    attackCd = 1
    attackRange = 100
    attackPower = 0
    critRate = 0
    skillIdArr = []
    skillMoveSpeedRate = 0
    skillAtkRate = 0
    skillEquipHp = 0
    skillSuckHpRate = 0
    equipAtk = 0
    equipHp = 0
    equipMoveSpeed = 0
    equipCritRate = 0
    equipAtkSpeed = 0
    equipExp = 0
    invincibleCnt = 0
    isAngel = false
    isGhost = false
    isBack = false
    randomCnt = 0
    ownerScript: XPlayerScript

    type = XPlayerType.E_Defender
    uuid = ""
    name = ""
    skinId = 0
    spwanPoint = 0
    bedModel: XBuildingModel
    takeMapBuild = false

    dizzyDurSec = 0
    dizzyStartTime = 0

    getSpeedPow() {
        let speedPow = 1;
        if (this.buffs)
            for (const buff of this.buffs) {
                if (buff.Type == XBuffType.SPEED) return speedPow = buff.result(1);
                buff.Type == XBuffType.SPEED_POW && (speedPow *= buff.result(1))
            }
        this.skillMoveSpeedRate && (speedPow *= 1 + this.skillMoveSpeedRate)
        this.equipMoveSpeed && (speedPow *= 1 + this.equipMoveSpeed)
        return speedPow
    }

    get stopRange() {
        return this.type == XPlayerType.E_Hunter ? this.attackRange : this.type == XPlayerType.E_Defender ? this.canBedRange : void 0
    }

    getAtkCD() {
        let attackCd = this.attackCd;
        let sum = attackCd;
        if (this.buffs)
            for (const i of this.buffs)
                i.Type != XBuffType.ATK_SPD && i.Type != XBuffType.DYC_ATK_SPD || (sum += i.result(attackCd));
        return sum = Math.max(.2, sum)
    }
    getAtkPow() {
        return this.attackPower
    }
    
    refreshEquip() {
        this.equipAtk = 0
        this.equipHp = 0
        this.equipMoveSpeed = 0
        this.equipCritRate = 0
        this.equipAtkSpeed = 0
        this.equipExp = 0
    }
}