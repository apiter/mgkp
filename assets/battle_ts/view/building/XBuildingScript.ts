import { _decorator, Component, director, Label, Node, rect, Sprite, tween, UITransform, v3, Vec3, view } from 'cc';
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
import XUtil from '../../xutil/XUtil';
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
    onHitting = false

    _skinSprite: Sprite = null
    _skinDiSprite: Sprite = null

    effects: XBaseEffect[] = []

    // hpLabel: Label = null

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
        // const hpNode = new Node("hpNode")
        // this.hpLabel = hpNode.addComponent(Label)
        // this.hpLabel.string = buildModel_.curHp.toString()
        // this.hpLabel.fontSize = 18
        // this.node.addChild(hpNode)
    }

    protected onDisable(): void {
        this.node.off(XEventNames.Hp_Changed, this.onHpChanged, this)
        this.node.off(XEventNames.Battle_Be_Hit, this.onHit, this)
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
        for (const e of this.effects)
            e.clear();
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
        {
            this.iconNode = new Node("iconNode")
            this._skinSprite = this.iconNode.addComponent(Sprite)
            this._skinSprite.spriteFrame = await XAtlasLoader.asyncFetchSpriteFrame(this.cfg.icon)
            this._skinSprite.trim = true
            this._skinSprite.sizeMode = Sprite.SizeMode.TRIMMED
            this.skinNode.addChild(this.iconNode);
        }
    }

    async initDiSkin() {
        if (this.cfg.diIcon) {
            if (!this.diNode) {
                this.diNode = new Node("diNode")
                this._skinDiSprite = this.diNode.addComponent(Sprite)
                this._skinDiSprite.spriteFrame = await XAtlasLoader.asyncFetchSpriteFrame(this.cfg.diIcon)
                this._skinDiSprite.trim = true
                this._skinDiSprite.sizeMode = Sprite.SizeMode.TRIMMED
                this.skinNode.addChild(this.diNode);
            }
        }
    }

    initBuffSkin() {

    }

    onHpChanged(target_: XBuildingModel) {
        if (this.data.isDie) {
            EventCenter.emit(XEventNames.E_BUILD_DEAD, this.data)
            this.onDead()
        }
    }

    onHit() {
        if (this.onHitting) return;
        this.onHitting = true;

        this.node.setScale(1, 1, 1);
        
        tween(this.node)
            .to(0.05, { scale: new Vec3(1.1, 1.1, 1) }) // scaleOut 1.1
            .to(0.1, { scale: new Vec3(0.8, 0.8, 1) })  // scaleIn 0.8
            .to(0.05, { scale: new Vec3(1, 1, 1) })     // scaleOut 1
            .call(() => {
                this.node.setScale(1, 1, 1);
                this.onHitting = false;
            })
            .start();
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

    upgrade() {
        //获取配置，改数值，改皮肤，播特效
        this.cfg = XMgr.buildingMgr.getBuildCfg(this.data.id, this.data.lv);
        this.cfg.icon && XAtlasLoader.asyncFetchSpriteFrame(this.cfg.icon).then((sf) => {
            this._skinSprite && this._skinSprite.isValid && (this._skinSprite.spriteFrame = sf)
        })
        this.cfg.diIcon && XAtlasLoader.asyncFetchSpriteFrame(this.cfg.diIcon).then((sf) => {
            this._skinDiSprite && this._skinDiSprite.isValid && (this._skinDiSprite.spriteFrame = sf)
        })

        this.initEffects()
    }

    protected onDestroy(): void {
        this.clearEffects()
        this.map.hideUpTips(this.data.x, this.data.y);
    }

    updateBuildCd() {
        // 如果没有处于冷却状态，直接返回 false
        if (!this.isBuildCd) return;

        // 每帧减少冷却时间
        this.buildCdTime -= XUtil.getFrameDelta(.033);

        // 更新冷却条宽度 (从 0 → 89 的进度条)
        // this.panel_buildCd.width = (60 - this.buildCdTime) / 60 * 89;

        // 冷却结束
        if (this.buildCdTime <= 0) {
            this.buildCdTime = 0;
            this.isBuildCd = false;

            // 移除冷却条节点
            // this.barNode.destroy();

            // 重新初始化
            this.onInit();
            this.initEffects();

            // 返回 true 表示冷却完成
            return true;
        }
    }

    isInStage() {
        // const mapPos = XMgr.mapMgr.gridPosToMapPos(this.data.x, this.data.y);

        // // 左下角和右上角（基于格子坐标转换）
        // const mapCheck1 = XMgr.mapMgr.isInStageByMapPos(mapPos.x - XConst.GridHalfSize, mapPos.y - XConst.GridHalfSize);
        // const mapCheck2 = XMgr.mapMgr.isInStageByMapPos(mapPos.x + XConst.GridHalfSize, mapPos.y + XConst.GridHalfSize);

        // // 左下角和右上角（基于节点坐标）
        // const nodeCheck1 = XMgr.mapMgr.isInStageByMapPos(this.node.x - XConst.GridHalfSize, this.node.y - XConst.GridHalfSize);
        // const nodeCheck2 = XMgr.mapMgr.isInStageByMapPos(this.node.x + XConst.GridHalfSize, this.node.y + XConst.GridHalfSize);

        // const building = XMgr.buildingMgr.getBuildCfg(this.data.x, this.data.y)
        // if(building)

        const worldAABB = this.node.getComponent(UITransform).getBoundingBoxToWorld()

        const screenSize = view.getVisibleSize();

        // 判断矩形是否和屏幕相交
        return (
            worldAABB.xMax >= 0 &&
            worldAABB.xMin <= screenSize.width &&
            worldAABB.yMax >= 0 &&
            worldAABB.yMin <= screenSize.height
        );
    }

    protected update(dt: number): void {
        this.updateBuildCd()
        if (!XMgr.gameMgr.isPause) {
            if (this.map) {
                if (this.isInStage()) {
                    // ---- 如果不是猎人身份 ----
                    if (!XMgr.gameMgr.isHunter()) {
                        // 检查当前位置是否可交互，并且能否升级建筑
                        const canHandle = XMgr.mapMgr.canHandleGrid(this.data.x, this.data.y)
                        if (canHandle &&
                            XMgr.buildingMgr.canUpgrade(XMgr.playerMgr.mineUuid, this.data)) {

                            // ---- 是否是自己房间/建筑 ----
                            let isMyBuilding = this.data.type == XBuildType.door
                                ? XMgr.playerMgr.mineRoomId == this.data.roomId  // 门需要房间ID匹配
                                : XMgr.playerMgr.mineUuid == this.data.playerUuid; // 其它建筑需要归属玩家匹配

                            // 不是特殊 ID(3008)，建筑激活时才显示升级提示
                            // if (3008 != this.data.id )
                            this.map.showUpTips(this.data.x, this.data.y, isMyBuilding);
                        } else {
                            // 否则隐藏提示
                            this.map.hideUpTips(this.data.x, this.data.y);
                        }
                    }
                } else {
                    this.map.hideUpTips(this.data.x, this.data.y);
                }
            }
        }
    }
}


