import { _decorator, Component, instantiate, Label, macro, Node, NodePool, Pool, Prefab, Sprite, SpriteAtlas, tween, Tween, UIOpacity } from 'cc';
import XMgr from '../../XMgr';
import { XBuildType, XGameMode, XGameStatus, XTokenType } from '../../xconfig/XEnum';
import LogWrapper from '../../log/LogWrapper';
import XBuildingModel from '../../model/XBuildingModel';
import { XBuildMenuScript } from './XBuildMenuScript';
const { ccclass, property } = _decorator;

interface OperateBtnInfo {
    buildType: XBuildType
    gridX: number
    gridY: number
    isOpen?: boolean
}

@ccclass('XGameUI')
export class XGameUI extends Component {
    @property(SpriteAtlas)
    gameUIAtlas: SpriteAtlas = null

    @property(Node)
    operateBtn: Node = null
    @property(Sprite)
    operateImg: Sprite = null

    @property(Label)
    lb_start_cd: Label = null

    @property(Prefab)
    pf_coin_tip: Prefab = null
    @property(Prefab)
    pf_energy_tip: Prefab = null


    _coin_tip_pool: NodePool = new NodePool()
    _energy_tip_pool: NodePool = new NodePool()

    _operateBtnInfo: OperateBtnInfo = null

    constructor() {
        super()
        XMgr.gameUI = this
    }

    start() {
        this.operateBtn.on(Node.EventType.TOUCH_END, this.onClickOperateBtn, this)
    }

    startGameCd() {
        this.lb_start_cd.node.active = true
        this.lb_start_cd.string = XMgr.cfg.constant.startTime.toString()
        this.schedule(this.countdownFunc, 1, macro.REPEAT_FOREVER, 1)
    }

    update(deltaTime: number) {

    }

    countdownFunc() {
        let timeLeft = Number(this.lb_start_cd.string) - 1;
        this.lb_start_cd.string = timeLeft.toString();

        if (timeLeft > 0) return;                       // 倒计时未结束，直接返回
        this.unschedule(this.countdownFunc)
        this.lb_start_cd.node.active = false;                  // 隐藏倒计时UI

        // ---- 5. 根据模式处理 ----
        switch (XMgr.gameMgr.gameMode) {
            case XGameMode.E_Defense:
                // 5秒后清除地图建筑
                break;

        }
        // ---- 6. 修改游戏状态 ----
        XMgr.gameMgr.setGameStatus(XGameStatus.E_GAME_START);
    }

    hideOperateBtn() {
        this.operateBtn.active = false
    }

    showDoorBtn(gridX_, gridY_, isOpen_) {
        const building = XMgr.buildingMgr.getBuilding(gridX_, gridY_)
        if (building) {
            this.operateBtn.active = true
            this.operateBtn.worldPosition = building.owner?.worldPosition
            this.operateImg.spriteFrame = isOpen_ ? this.gameUIAtlas.getSpriteFrame("img_kaimen") : this.gameUIAtlas.getSpriteFrame("img_guanmen")
            this._operateBtnInfo = { buildType: XBuildType.door, gridX: gridX_, gridY: gridY_, isOpen: isOpen_ }
        }
    }

    showBedBtn(gridX_, gridY_) {
        const building = XMgr.buildingMgr.getBuilding(gridX_, gridY_)
        if (building) {
            this.operateBtn.active = true
            this.operateBtn.worldPosition = building.owner?.worldPosition
            this.operateImg.spriteFrame = this.gameUIAtlas.getSpriteFrame("img_shangchuang")
            this._operateBtnInfo = { buildType: XBuildType.bed, gridX: gridX_, gridY: gridY_, }
        }
    }

    onClickOperateBtn() {
        this.hideOperateBtn()
        switch (this._operateBtnInfo?.buildType) {
            case XBuildType.door:
                if (this._operateBtnInfo.isOpen) {
                    XMgr.buildingMgr.openDoorByGridPos(this._operateBtnInfo.gridX, this._operateBtnInfo.gridY)
                } else {
                    XMgr.buildingMgr.closeDoorByGridPos(this._operateBtnInfo.gridX, this._operateBtnInfo.gridY)
                }
                break
            case XBuildType.bed:
                const result = XMgr.gameMgr.upBed(this._operateBtnInfo.gridX, this._operateBtnInfo.gridY, XMgr.playerMgr.mineUuid)
                break
        }
    }

    showBuildMeun(gridX_, gridY_) {
        //TODO show dialog
        const room = XMgr.mapMgr.getRoomByGridPos(gridX_, gridY_)
        if (!room)
            return
        // XMgr.buildingMgr.build(XMgr.playerMgr.mineUuid, 3000, gridX_, gridY_, 0, 1)

        XBuildMenuScript.show({ gridX: gridX_, gridY: gridY_, level: 1, angle: 0 })
    }

    hideAllMenu() {
        LogWrapper.log(`GameUI`, "hideAllMenu", {})
    }

    showUpgradeMeun(gridX_, gridY_, building_: XBuildingModel) {
        //TODO show dialog
        XMgr.buildingMgr.upgrade(building_.playerUuid, gridX_, gridY_)
    }

    valueTips(type_: XTokenType, baseValue_, x_, y_, extraValue_ = 0) {
        let node = this._get_node(type_)
        node.active = true
        XMgr.mapMgr.mapNode.addChild(node)
        node.x = x_
        node.y = y_

        const lb = node.getChildByName("value").getComponent(Label)
        if (baseValue_ > 999) {
            const e = baseValue_ / 1e3;
            lb.string = `+${Math.floor(e)}k`;
        } else {
            lb.string = baseValue_ >= 0 ? `+${baseValue_}` : `${baseValue_}`;
        }

        const uiOpacity = node.getComponent(UIOpacity)
        uiOpacity.opacity = 255

        Tween.stopAllByTarget(uiOpacity)
        Tween.stopAllByTarget(node)
        tween(node).to(1, { y: y_ + 50 }).start()
        tween(uiOpacity).to(1, { opacity: 255 }).call(() => {
            this._recycle_tip_node(type_, node)
        }).start()
    }

    _get_node(type_: XTokenType) {
        let node = type_ == XTokenType.E_Coin ? this._coin_tip_pool.get() : this._energy_tip_pool.get()
        if (!node) {
            let pf = this._get_tip_prefab(type_)
            node = instantiate(pf)
        }
        return node
    }

    _get_tip_prefab(type_: XTokenType) {
        switch (type_) {
            case XTokenType.E_Coin:
                return this.pf_coin_tip
            case XTokenType.E_Energy:
                return this.pf_energy_tip
        }
    }

    _recycle_tip_node(type_: XTokenType, node_: Node) {
        node_.active = false
        node_.removeFromParent()
        type_ == XTokenType.E_Coin ? this._coin_tip_pool.put(node_) : this._energy_tip_pool.put(node_)
    }
}


