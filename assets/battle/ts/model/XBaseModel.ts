export default class XBaseModel {
    curHp = 1
    maxHp = 1
    roomId = -1
    isDie = false
    lv = 1
    coinRatio = 1
    energyRatio = 1
    invincible = false
    invincible_skill = false
    buffs = []
    
    get hpPercent() {
        return this.curHp / this.maxHp
    }
}