import { _decorator, Component, Node } from 'cc';
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
    
    _bt:XAIHunter = null

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
            this._bt.canPatrol(this._bt.patrol())
        ], XEPolicy.RequireOne, "HunterBT")
        this._bt.load(bt_seq)
    }

    protected update(dt: number): void {
        if(this.isSkinLoaded && XMgr.gameMgr.gameStatus === XGameStatus.E_GAME_START && !XMgr.gameMgr.isPause) {
            this._bt?.exec()
        }
    }
}


