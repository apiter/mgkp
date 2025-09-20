import { _decorator, game, math, sp } from 'cc';
import { XPlayerScript } from './XPlayerScript';
import XPlayerModel from '../../model/XPlayerModel';
import { XGameStatus, XPlayerType } from '../../xconfig/XEnum';
import XMgr from '../../XMgr';
import { XAIHunter } from '../../xai/XAIHunter';
import XBTUtil from '../../bt2/XBTUtil';
import { XEPolicy } from '../../bt2/XBTEnum';
import { XDifficultCfgItem } from '../../xconfig/XCfgData';
import EventCenter from '../../event/EventCenter';
import { XEventNames } from '../../event/XEventNames';
import LogWrapper, { XLogModule } from '../../log/LogWrapper';
import { XHealthBar } from '../other/XHealthBar';
const { ccclass, property } = _decorator;

@ccclass('XHunterScript')
export class XHunterScript extends XPlayerScript {

    _bt: XAIHunter = null
    isAtking = false
    atkCnt = 0
    lv = 1
    dCfg: XDifficultCfgItem
    maxHpAddRate = 0
    isOutHeal = false
    lastHealTime = 0
    healSpeed = 0.1
    isFirstOutHeal = false


    constructor() {
        super()
        this.type = XPlayerType.E_Hunter
    }

    init(data_: XPlayerModel): void {
        super.init(data_)
    }

    onInit(): void {
        this.dCfg = XMgr.gameMgr.dCfg
        this.data.uuid != XMgr.playerMgr.mineUuid && this.initBt()

        this.createHealthBar()
        this.healthBar?.setLv(this.lv)
        
        this.maxHpAddRate = XMgr.gameMgr.dCfg.addMaxHp ? XMgr.gameMgr.dCfg.addMaxHp : 0 
    }

    initBt() {
        this._bt = new XAIHunter(this)
        let bt_seq = XBTUtil.bt_sequenceOr([
            this._bt.canEscape(this._bt.escape("move")),
            this._bt.canPatrol(this._bt.patrol()),
            this._bt.attack()
        ], XEPolicy.RequireOne, "HunterBT")
        this._bt.load(bt_seq)
    }

    protected update(dt: number): void {
        if (this.isSkinLoaded && XMgr.gameMgr.gameStatus === XGameStatus.E_GAME_START && !XMgr.gameMgr.isPause) {
            this.checkHealZone()
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
        spine.setEndListener((trackEntry) => {
            if (trackEntry.animation.name == 'attack1') {
                spine.setAnimation(0, "idle", false)
                this.isAtking = false
            }
        })

        this.scheduleOnce(() => {
            //结算伤害
            let baseAtkPow = this.data.getAtkPow()
            baseAtkPow = Math.max(baseAtkPow, 1)
            XMgr.gameMgr.takeDamage(this.data, target_, baseAtkPow)
            this.atkCnt++
            this.checkUpgrade()
        }, 0.1)
    }

    checkUpgrade() {
        let upAtcCntList = XMgr.cfg.hunterCfg.upAtcCntList;
        if (this.lv <= upAtcCntList.length) {
            let atkNeedCnt = upAtcCntList[this.lv - 1];
            atkNeedCnt = Math.ceil(atkNeedCnt * (1 + this.dCfg.upRate)),
                this.data.equipExp && (atkNeedCnt = Math.ceil(atkNeedCnt * (1 - this.data.equipExp))),
                atkNeedCnt <= this.atkCnt && this.upgrade(atkNeedCnt)
        }
    }

    upgrade(atkCnt_) {
        this.atkCnt -= atkCnt_
        this.lv += 1

        this.data.lv = this.lv;

        // 计算属性
        let hpList = XMgr.cfg.hunterCfg.hpList;
        let attackList = XMgr.cfg.hunterCfg.attackList;
        let hpMax = hpList[this.lv - 1] * (1 + this.maxHpAddRate);
        let atk = attackList[this.lv - 1];
        this.data.attackPower = atk
        XMgr.gameMgr.changeMaxHp(this.data, hpMax, hpMax)

        this.healthBar?.setLv(this.lv)
        EventCenter.emit(XEventNames.E_Hunter_Upgrade, this.lv)

        LogWrapper.log("流程", `噬魂者升到${this.lv}等级`, {}, [XLogModule.XLogModuleGameFlow])
    }

    setEscape(value_: any): void {
        this.isEscaped = value_
    }

    checkHealZone() {
        // 1. 判断当前是否在治疗区
        let inZone = XMgr.mapMgr.isInHealZone(this.node.x, this.node.y);
    
        if (inZone) {
            // ---- 刚进入治疗区 ----
            if (this.isOutHeal) {
                this.isOutHeal = false;
    
                // 处理技能效果
                for (const skillId of this.data.skillIdArr) {
                }
    
                // 切换皮肤效果（可能是回血特效）
                // this.changeSkin(true);
            }
    
            // ---- 区域内持续回血逻辑 ----
            let dt = game.deltaTime ; // 秒
            this.lastHealTime += dt;
    
            // 每秒执行一次回血
            if (this.lastHealTime >= 1 && this.data.hpPercent < 1) {
                this.lastHealTime = 0;
    
                let healValue = this.healSpeed;
                // 执行回血
                XMgr.gameMgr.addHp(this.data, healValue);
            }
    
            // 在回血区时无敌
            this.data.invincible = true;
    
        } else {
            // ---- 离开治疗区 ----
            if (!this.isOutHeal) {
                if (this.isFirstOutHeal) {
                    this.isFirstOutHeal = false;
                } 
                this.isOutHeal = true;
            }
    
            // 离开治疗区 → 取消无敌 & 重置计时
            this.data.invincible = false;
            this.lastHealTime = 0;
        }
    }
}


