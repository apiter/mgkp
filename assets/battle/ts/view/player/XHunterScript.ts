import { _decorator, math, sp } from 'cc';
import { XPlayerScript } from './XPlayerScript';
import XPlayerModel from '../../model/XPlayerModel';
import { XGameStatus, XPlayerType } from '../../xconfig/XEnum';
import XMgr from '../../XMgr';
import { XAIHunter } from '../../xai/XAIHunter';
import XBTUtil from '../../bt2/XBTUtil';
import { XEPolicy } from '../../bt2/XBTEnum';
const { ccclass, property } = _decorator;

@ccclass('XHunterScript')
export class XHunterScript extends XPlayerScript {

    _bt: XAIHunter = null
    isAtking = false
    atkCnt = 0

    constructor() {
        super()
        this.type = XPlayerType.E_Hunter
    }

    init(data_: XPlayerModel): void {
        super.init(data_)
    }

    onInit(): void {
        this.data.uuid != XMgr.playerMgr.mineUuid && this.initBt()
    }

    initBt() {
        this._bt = new XAIHunter(this)
        let bt_seq = XBTUtil.bt_sequenceOr([
            this._bt.canPatrol(this._bt.patrol()),
            this._bt.attack()
        ], XEPolicy.RequireOne, "HunterBT")
        this._bt.load(bt_seq)
    }

    protected update(dt: number): void {
        if (this.isSkinLoaded && XMgr.gameMgr.gameStatus === XGameStatus.E_GAME_START && !XMgr.gameMgr.isPause) {
            this._bt?.exec()
        }
    }

    getAttackCd() {
        const baseAtkCd = this.data.getAtkCD()

        let retAckCd = baseAtkCd
        return retAckCd
    }


    attack(target_) {
        if (this.data.isDie)
            return
        this.isAtking = true
        const spine = this.spineNode.getComponent(sp.Skeleton)
        spine.setAnimation(0, "attack1", false)
        spine.setEndListener((trackEntry)=>{
            if(trackEntry.animation.name == 'attack1') {
                spine.setAnimation(0, "idle", false)
                this.isAtking = false
            }
        })

        //结算伤害
        let baseAtkPow = this.data.getAtkPow()
        baseAtkPow = Math.max(baseAtkPow, 1)
        XMgr.gameMgr.takeDamage(this.data, target_, baseAtkPow)
        this.atkCnt++
    }
}


