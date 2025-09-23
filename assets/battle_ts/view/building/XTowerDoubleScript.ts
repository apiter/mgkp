import { _decorator, Component, game, Node, Sprite, tween, v3, Vec2 } from 'cc';
import { XBuildingScript } from './XBuildingScript';
import XTowerModel from '../../model/XTowerModel';
import { XConst } from '../../xconfig/XConst';
import XAtlasLoader from 'db://assets/XAtlasLoader';
import XMgr from '../../XMgr';
import { XV2Util01 } from '../../xutil/XV2Util01';
import XPlayerModel from '../../model/XPlayerModel';
import { XBulletScript } from './XBulletScript';
import { XTowerBaseScript } from './XTowerBaseScript';
const { ccclass, property } = _decorator;

@ccclass('XTowerDoubleScript')
export class XTowerDoubleScript extends XTowerBaseScript {
    diNodeR: Node = null
    iconNodeR: Node = null
    _skinDiSpriteR: Sprite = null
    _skinSpriteR: Sprite = null
    atkTarget

    async initSkin() {
        if (this.cfg.diIcon) {
            this.diNode = new Node("diNodeL")
            this._skinDiSprite = this.diNode.addComponent(Sprite)
            this._skinDiSprite.spriteFrame = await XAtlasLoader.asyncFetchSpriteFrame(this.cfg.diIcon)
            this._skinDiSprite.trim = true
            this._skinDiSprite.sizeMode = Sprite.SizeMode.TRIMMED
            this.skinNode.addChild(this.diNode);
            this.diNode.x = -25


            this.diNodeR = new Node("diNodeR")
            this._skinDiSpriteR = this.diNodeR.addComponent(Sprite)
            this._skinDiSpriteR.spriteFrame = await XAtlasLoader.asyncFetchSpriteFrame(this.cfg.diIcon)
            this._skinDiSpriteR.trim = true
            this._skinDiSpriteR.sizeMode = Sprite.SizeMode.TRIMMED
            this.skinNode.addChild(this.diNodeR);
            this.diNodeR.x = 25
        }

        this.iconNode = new Node("iconNodeL")
        this._skinSprite = this.iconNode.addComponent(Sprite)
        this._skinSprite.spriteFrame = await XAtlasLoader.asyncFetchSpriteFrame(this.cfg.icon)
        this._skinSprite.trim = true
        this._skinSprite.sizeMode = Sprite.SizeMode.TRIMMED
        this.skinNode.addChild(this.iconNode);
        this.iconNode.x = - 25


        this.iconNodeR = new Node("iconNodeR")
        this._skinSpriteR = this.iconNodeR.addComponent(Sprite)
        this._skinSpriteR.spriteFrame = await XAtlasLoader.asyncFetchSpriteFrame(this.cfg.icon)
        this._skinSpriteR.trim = true
        this._skinSpriteR.sizeMode = Sprite.SizeMode.TRIMMED
        this.skinNode.addChild(this.iconNodeR);
        this.iconNodeR.x = 25
    }

    tryAttack() {
        let target = this.findTarget();

        if (target) {
            this.atkTarget = target;

            XV2Util01.faceToCC(this.diNode, target.owner.worldPositionX, target.owner.worldPositionY, -90);
            XV2Util01.faceToCC(this.diNodeR, target.owner.worldPositionX, target.owner.worldPositionY, -90);
            XV2Util01.faceToCC(this.iconNode, target.owner.worldPositionX, target.owner.worldPositionY, -90);
            XV2Util01.faceToCC(this.iconNodeR, target.owner.worldPositionX, target.owner.worldPositionY, -90);

            this.fire(target);

            this.isWork = true;
        } else {
            this.isWork = false;
        }
    }

    fire(target: XPlayerModel) {
        for (let i = 0; i < 2; i++) {
            let bulletNode = XMgr.bulletMgr.createBulletNode(this.cfg.bullet);
            if (!bulletNode) return;

            if (i == 0) {
                bulletNode.rotation = this.iconNode.rotation;
                bulletNode.x = this.node.x - 30;  // 左边炮口
            } else {
                bulletNode.rotation = this.iconNodeR.rotation;
                bulletNode.x = this.node.x + 30;  // 右边炮口
            }
            bulletNode.y = this.node.y;

            let bulletScript = bulletNode.getComponent(XBulletScript);
            bulletScript && bulletScript.destroy();


            let dir = target
                ? new Vec2(target.owner.x - bulletNode.x, target.owner.y - bulletNode.y)
                : new Vec2(
                    Math.cos((bulletNode.angle - 90) * Math.PI / 180),
                    Math.sin((bulletNode.angle - 90) * Math.PI / 180)
                );
            dir.normalize();
            bulletScript = bulletNode.addComponent(XBulletScript);

            let damage = this.cfg.atkDamage
            bulletScript.shoot(this.cfg.bullet, damage, dir, target, this.data)

            const iconNodes = [this.iconNode, this.iconNodeR]

            tween(iconNodes[i])
                .to(0.05, { scale: v3(1.1, 1.1, 1) })
                .to(0.1, { scale: v3(0.8, 0.8, 1.0) })
                .to(0.05, { scale: v3(1.0, 1.0, 1.0) })
                .call(() => {

                })
                .start()
        }
    }

    upgrade() {
        //获取配置，改数值，改皮肤，播特效
        this.cfg = XMgr.buildingMgr.getBuildCfg(this.data.id, this.data.lv);
        this.cfg.icon && XAtlasLoader.asyncFetchSpriteFrame(this.cfg.icon).then((sf) => {
            this._skinSprite && this._skinSprite.isValid && (this._skinSprite.spriteFrame = sf)
            this._skinSpriteR && this._skinSpriteR.isValid && (this._skinSpriteR.spriteFrame = sf)
        })
        this.cfg.diIcon && XAtlasLoader.asyncFetchSpriteFrame(this.cfg.diIcon).then((sf) => {
            this._skinDiSprite && this._skinDiSprite.isValid && (this._skinDiSprite.spriteFrame = sf)
            this._skinDiSpriteR && this._skinDiSpriteR.isValid && (this._skinDiSpriteR.spriteFrame = sf)
        })

        this.initEffects()
    }

}


