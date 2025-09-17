import { _decorator, Component, Node, Sprite, SpriteFrame, UIOpacity, UITransform } from 'cc';
import XBaseModel from '../../model/XBaseModel';
import { XEventNames } from '../../event/XEventNames';
const { ccclass, property } = _decorator;

@ccclass('XHealthBar')
export class XHealthBar extends Component {
    @property(SpriteFrame)
    sf_health_red: SpriteFrame = null
    @property(SpriteFrame)
    sf_health_green: SpriteFrame = null

    // @property(Sprite)
    // spr_health_bar_white: Sprite = null
    @property(Sprite)
    spr_health_bar: Sprite = null

    _dataModel: XBaseModel = null
    _barWidth = 0
    _barDeltaY = 0

    protected onLoad(): void {
        this._barWidth = this.spr_health_bar.getComponent(UITransform).width
        this.node.getComponent(UIOpacity).opacity = 0
    }

    protected lateUpdate(dt: number): void {
        if(this._dataModel.owner.isValid) {
            this.node.x = this._dataModel.owner.x
            this.node.y = this._dataModel.owner.y + this._barDeltaY
        }
    }

    init(data_: XBaseModel, bNotDefender = false, deltaY = 0) {
        this._dataModel = data_
        this._barDeltaY = deltaY
        this._dataModel.owner.on(XEventNames.Hp_Changed, this.onHpChanged, this)

        this.spr_health_bar.spriteFrame = bNotDefender ? this.sf_health_red : this.sf_health_green
        this.updateHealth()
    }

    onHpChanged() {
        this.updateHealth()
    }

    updateHealth() {
        if(!this.node.isValid)
            return
        if(this._dataModel.curHp < this._dataModel.maxHp && !this._dataModel.isDie) {
            this.node.getComponent(UIOpacity).opacity = 255
            this.spr_health_bar.getComponent(UITransform).width = this._barWidth * this._dataModel.curHp / this._dataModel.maxHp
        }
    }
}


