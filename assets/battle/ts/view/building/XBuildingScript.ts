import { _decorator, Component, Label, Node, Sprite, UITransform, v3 } from 'cc';
import { XConst } from '../../xconfig/XConst';
import XBuildingModel from '../../model/XBuildingModel';
import XMgr from '../../XMgr';
import { XEventNames } from '../../event/XEventNames';
import { XMapView } from '../XMapVIew';
import { XBuildType, XEffectType, XGameMode } from '../../xconfig/XEnum';
import XAtlasLoader from 'db://assets/XAtlasLoader';
import { XEffectBuilder } from '../../effect/XEffectBuilder';
import { XBaseEffect } from '../../effect/XBaseEffect';
import EventCenter from '../../event/EventCenter';
const { ccclass, property } = _decorator;

@ccclass('XBuildingScript')
export class XBuildingScript extends Component {
    map: XMapView = null

    data: XBuildingModel = null
    skinNode: Node = null
    aniNode: Node = null
    diNode: Node = null
    iconNode: Node = null

    cfg: any = null
    isBuildCd = false
    buildCdTime = 0

    effects: XBaseEffect[] = []

    hpLabel: Label = null

    init(buildModel_: XBuildingModel, cdTime_ = 0) {
        this.skinNode = new Node("SkinNode")
        let uiTrans = this.skinNode.addComponent(UITransform)
        uiTrans.setContentSize(90, 90)
        this.aniNode = new Node("aniNode")
        uiTrans = this.aniNode.addComponent(UITransform)
        uiTrans.setContentSize(90, 90)
        let scale = XConst.GridSize / 90;
        this.skinNode.scale = v3(scale, scale, scale)
        this.aniNode.scale = v3(scale, scale, scale)
        this.node.addChild(this.skinNode)
        this.node.addChild(this.aniNode)

        this.data = buildModel_
        this.data.ownerScript = this
        this.cfg = XMgr.buildingMgr.getBuildCfg(this.data.id, this.data.lv)
        this.initSkin()
        this.node.on(XEventNames.Hp_Changed, this.onHpChanged, this)
        this.node.on(XEventNames.Battle_Be_Hit, this.onHit, this)
        if (cdTime_) {
            this.isBuildCd = true
            this.buildCdTime = cdTime_
            this.initCdUI(buildModel_)
        } else {
            this.onInit()
            this.initEffects()
        }
        const hpNode = new Node("hpNode")
        this.hpLabel = hpNode.addComponent(Label)
        this.hpLabel.string = buildModel_.curHp.toString()
        this.node.addChild(hpNode)
    }

    onInit() {

    }

    initCdUI(e) {
    }

    initEffects() {
        if (this.cfg.effectList && 0 != this.cfg.effectList.length) {
            for (let idx = this.effects.length - 1; idx >= 0; --idx) {
                let t = this.effects[idx];
                t.clearFlag && t.clear()
            }
            this.effects = []
            for (const effectCfg of this.cfg.effectList) {
                let effect: XBaseEffect = XEffectBuilder.createEffect(effectCfg, this.data);
                if (effect) {
                    effect.clearFlag = true
                    this.addEffect(effect)
                    //TODO
                }
            }
        }
    }

    addEffect(e) {
        this.effects.push(e)
    }
    clearEffects() {
        for (const e of this.effects) e.clear();
        this.effects = []
    }
    removeEffect(e) {
        if (!this.effects || !this.effects.length) return;
        let t = this.effects.findIndex(t => t == e); - 1 != t && (this.effects[t].clear(), this.effects.splice(t, 1))
    }

    async initSkin() {
        this.skinNode.removeAllChildren()
        this.initDiSkin();
        let isSelf = false;
        this.data.playerUuid == XMgr.playerMgr.player.uuid && (isSelf = true)
        // if (isSelf && this.cfg.buffId && XMgr.user.gameInfo.getBuffData(this.cfg.buffId[0]) && XMgr.gameMgr.gameMode == XGameMode.E_Defense) {
        //     this.initBuffSkin();
        // } else if (this.cfg.buildAni) {
        //      EffectUtil.I.playBuildAni(this.cfg.buildAni, this.skinNode);
        // } else 
        {
            this.iconNode = new Node("iconNode")
            const spr = this.iconNode.addComponent(Sprite)
            spr.spriteFrame = await XAtlasLoader.asyncFetchSpriteFrame(this.cfg.icon)
            spr.trim = true
            spr.sizeMode = Sprite.SizeMode.CUSTOM
            this.skinNode.addChild(this.iconNode);
        }
    }

    async initDiSkin() {
        if (this.cfg.diIcon) {
            if (!this.diNode) {
                this.diNode = new Node("diNode")
                const spr = this.diNode.addComponent(Sprite)
                spr.spriteFrame = await XAtlasLoader.asyncFetchSpriteFrame(this.cfg.diIcon)
                spr.trim = true
                spr.sizeMode = Sprite.SizeMode.CUSTOM
                this.skinNode.addChild(this.diNode);
            }
        }
    }

    initBuffSkin() {

    }

    onHpChanged(target_: XBuildingModel) {
        this.hpLabel.string = this.data.curHp.toString()
        if (this.data.isDie) {
            EventCenter.emit(XEventNames.E_BUILD_DEAD, this.data)
            this.onDead()
        }
    }

    onHit() {

    }

    onDead() {
        // 如果是自己玩家死亡
        if (XMgr.playerMgr.mineUuid == this.data.playerUuid) {
            XMgr.gameMgr.addDataInArr(this.data);
        } else if (this.data.type && this.data.type == XBuildType.door && XMgr.playerMgr.player.roomId == this.data.roomId) {
            XMgr.gameMgr.addDataInArr(this.data);
        }

        // 最后无论如何都要销毁建筑
        XMgr.buildingMgr.destroyBuilding(this.data.playerUuid, this.data.x, this.data.y, false);
    }
}


