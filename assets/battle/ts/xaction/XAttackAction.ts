import { _decorator, Component, game, Node } from 'cc';
import XBTAction from '../bt2/XBTAction';
import { XBTStatus } from '../bt2/XBTEnum';
import XBTTick from '../bt2/XBTTick';
import { XPlayerScript } from '../view/player/XPlayerScript';
const { ccclass, property } = _decorator;

@ccclass('XAttackAction')
export class XAttackAction extends XBTAction {
    static NAME = "XAttackAction"

    lastTarget = null
    lastAttackTime = 0

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
        const timeNow = game.totalTime
        if(!playerScript.getLastAtkTarget()) {
            playerScript.setLastAtkTarget(curTarget)
        }

        if(timeNow - this.lastAttackTime >= attackCd * 1000) {
            playerScript.attack(curTarget)
            this.lastAttackTime = timeNow

            return XBTStatus.SUCCESS
        }
        //TODO 逃跑？
        return XBTStatus.SUCCESS
    }
}


