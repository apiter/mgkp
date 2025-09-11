import { _decorator, Component, Node } from 'cc';
import { XPlayerScript } from './XPlayerScript';
import { XGameMode, XPlayerType } from '../../xconfig/XEnum';
import XMgr from '../../XMgr';
import { XRandomUtil } from '../../xutil/XRandomUtil';
import { XPlayerAI } from '../../xai/XAIPlayer';
import XBTUtil from '../../bt2/XBTUtil';
import { XEPolicy } from '../../bt2/XBTEnum';
const { ccclass, property } = _decorator;

@ccclass('XDefenderScript')
export class XDefenderScript extends XPlayerScript {
    skinBedImgNode: Node = null
    _ai: XPlayerAI = null

    constructor() {
        super()
        this.type = XPlayerType.E_Defender
    }

    protected onLoad(): void {
        this.moveSpeed = XMgr.cfg.constant.playerMoveSpeed * 1.5
    }

    onInit() {
        // 默认等级和速度系数
        let speedFactor = 1;

        // 是否是自己玩家
        if (this.data.uuid !== XMgr.playerMgr.mineUuid) {
            this.initAI();

            if (XMgr.gameMgr.gameMode == XGameMode.E_Defense) {
                speedFactor = 1.1;
            } else if (XMgr.gameMgr.gameMode == XGameMode.E_Hunt) {
            } else {
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
        this._ai = new XPlayerAI(this);

        let root = XBTUtil.bt_sequenceOr(
            [
                this._ai.notInBed(this._ai.findMapBuild(this._ai.run("move", true))),
                this._ai.notInBed(this._ai.takeMapBuild()),
                this._ai.notInBed(this._ai.findBed(this._ai.run("move", true))),
                this._ai.notInBed(this._ai.gotoBed()),
                this._ai.upOrBuild(),
                this._ai.idle("idle")
            ],
            XEPolicy.RequireOne,
            "root"
        );
        this._ai.load(root)
    }

    upBed(e) {
        let mapPos = XMgr.mapMgr.gridPosToMapPos(e.x, e.y);
        this.pos(mapPos.x, mapPos.y)
        // this.lb_name.visible = !1, 
        this.skinBedImgNode ? (this.skinBedImgNode.active = true, this.spineNode && (this.spineNode.active = false)) : this.playAnim("idle") 
        // this.takeMapBuildNode.visible = !1
    }
    downBed() {
        if (this.skinBedImgNode) {
            // this.skinBedImg.visible = false;

            // if (this.skinSpine) {
            //     this.skinSpine.visible = true;
            // } else if (this.skinImg) {
            //     this.skinImg.visible = true;
            // }
        } else {
            this.playAnim("move");
        }
    }

    dtWait = 0
    update(dt) {
        this.dtWait += dt
        // if (this.dtWait < 0.1)
        //     return
        this.dtWait = 0
        if (this.isSkinLoaded) {
            if (!XMgr.gameMgr.isPause && !this.data.isDie) {
                if (!this.data.isBed) {
                    this.node.setSiblingIndex(this.node.y)
                }
                if (this._ai) {
                    this._ai.exec();
                }
            }
        }

    }
}


