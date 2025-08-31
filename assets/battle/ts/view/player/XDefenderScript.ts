import { _decorator, Component, Node } from 'cc';
import { XPlayerScript } from './XPlayerScript';
import { XGameMode, XPlayerType } from '../../xconfig/XEnum';
import XMgr from '../../XMgr';
import { XRandomUtil } from '../../xutil/XRandomUtil';
import { XPlayerAI } from '../../xai/XAIPlayer';
import XBTUtil from '../../bt2/XBTUtil';
const { ccclass, property } = _decorator;

@ccclass('XDefenderScript')
export class XDefenderScript extends XPlayerScript {
    skinBedImg: Node = null
    ai:XPlayerAI = null

    constructor() {
        super()
        this.type = XPlayerType.E_Defender
    }

    protected onLoad(): void {
        this.moveSpeed = XMgr.cfg.constant.playerMoveSpeed
    }

    onInit() {
        // 默认等级和速度系数
        let level = XMgr.user.gameInfo.maxLevel;
        let speedFactor = 1;

        // 是否是自己玩家
        if (this.data.uuid !== XMgr.playerMgr.mineUuid) {
            this.initAI();

            if (XMgr.gameMgr.gameMode == XGameMode.E_Defense) {
                speedFactor = 1.1;
            } else if (XMgr.gameMgr.gameMode == XGameMode.E_Hunt) {
                // 随机生成等级
                level = XRandomUtil.getIntRandom(
                    XMgr.gameMgr.dCfg.lvlFloor - 1,
                    XMgr.gameMgr.dCfg.lvlCeil
                ) + XMgr.gameMgr.dCfg.id;
                level = Math.min(26, level);
            } else {
                // 其他模式
                level = this.getRandomLv();
            }
        } else {
            // 如果是自己玩家并且在防御模式，额外加速
            if (XMgr.gameMgr.gameMode == XGameMode.E_Defense) {
                speedFactor = 1.5;
            }
            // 自己的移动速度要除以加速系数
            this.moveSpeed /= XMgr.gameMgr.speedRatio;
        }

        // 应用速度系数
        this.moveSpeed *= speedFactor;
    }

    getRandomLv() {
        let arr = [28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3]
        let sum = 0;
        for (const num of arr) sum += num;
        let randNum = XRandomUtil.getIntRandom(0, sum)
        let a = 1;
        for (const num of arr) {
            if (randNum <= num) break;
            randNum -= num, a += 1
        }
        a > XMgr.cfg.difficultCfg.size && (a = XMgr.cfg.difficultCfg.size)
        return a
    }

    initAI() {
        this.ai = new XPlayerAI(this);

        let e = XBTUtil.bt_sequenceOr([this.ai.notInBed(this.ai.findMapBuild(this.ai.run("run", true))), 
            this.ai.notInBed(this.ai.takeMapBuild()), 
            this.ai.notInBed(this.ai.findBed(this.ai.run("run", !0))), 
            this.ai.notInBed(this.ai.gotoBed()), 
            this.ai.upOrBuild(), 
            this.ai.idle("idle")]);
        this.ai.load(e)
    }

    upBed(e) {
        let mapPos = XMgr.mapMgr.gridPosToMapPos(e.x, e.y);
        this.pos(mapPos.x, mapPos.y)
        // this.lb_name.visible = !1, 
        // this.skinBedImg ? (this.skinBedImg.visible = !0, this.skinSpine ? this.skinSpine.visible = !1 : this.skinImg && (this.skinImg.visible = !1)) : this.playAnim("idle"), 
        // this.takeMapBuildNode.visible = !1
    }
    downBed() {
        if (this.skinBedImg) {
            // this.skinBedImg.visible = false;

            // if (this.skinSpine) {
            //     this.skinSpine.visible = true;
            // } else if (this.skinImg) {
            //     this.skinImg.visible = true;
            // }
        } else {
            this.playAnim("run");
        }
    }

    update(dt) {
        if (this.isSkinLoaded) {
            if (!XMgr.gameMgr.isPause && !this.data.isDie) {
                if (!this.data.isBed) {
                    this.node.setSiblingIndex(this.node.y)
                }
                if (this.ai) {
                    this.ai.exec();
                }
            }
        }

    }
}


