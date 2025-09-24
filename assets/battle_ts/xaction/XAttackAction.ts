import { _decorator, game } from 'cc';
import XBTAction from '../bt2/XBTAction';
import { XBTStatus } from '../bt2/XBTEnum';
import XBTTick from '../bt2/XBTTick';
import { XPlayerScript } from '../view/player/XPlayerScript';
import { XPropertiesKey } from '../xcdt/XPropertiesKey';

export class XAttackAction extends XBTAction {
    static NAME = "XAttackAction"

    lastTarget = null
    lastAttackTime = 0
    atkRageStartTs = 0

    constructor() {
        super({
            name: XAttackAction.NAME,
            title: XAttackAction.NAME,
            properties: null
        })
    }

    tick(tick_: XBTTick): XBTStatus {
        const playerScript = tick_.target as XPlayerScript
        const attackCd = playerScript.getAttackCd()
        const curTarget = playerScript.getCurTarget()
        const playerModel = playerScript.getDataModel()
        const timeNowInMs = game.totalTime

        if(playerModel.isRage) {
            this.atkRageStartTs = timeNowInMs
            // console.log(`[设置狂暴开始]playerModel.isRage${this.atkRageStartTs}`)
        }
        if(!playerScript.getLastAtkTarget()) {
            playerScript.setLastAtkTarget(curTarget)
            this.atkRageStartTs = timeNowInMs
            // console.log(`[设置狂暴开始]playerScript.getLastAtkTarget${this.atkRageStartTs}`)
        }

        if(!this.lastTarget || this.lastTarget.owner != curTarget.owner) {
            this.atkRageStartTs = timeNowInMs
            this.lastTarget = curTarget
            playerScript.setStartAtkTime(timeNowInMs)
            
            // console.log(`[设置狂暴开始]改变攻击目标${this.atkRageStartTs}`)
        }
        if(timeNowInMs - this.lastAttackTime >= attackCd * 1000) {

            if(timeNowInMs - this.atkRageStartTs > 20000) {
                tick_.blackboard.set(XPropertiesKey.SKILLID, "rage", tick_.tree.id)
                this.atkRageStartTs = timeNowInMs
                // console.log(`[设置狂暴开始]狂暴${this.atkRageStartTs}`)
            }

            playerScript.attack(curTarget)
            this.lastAttackTime = timeNowInMs

            return XBTStatus.SUCCESS
        }
        //TODO 逃跑？
        return XBTStatus.SUCCESS
    }
}


