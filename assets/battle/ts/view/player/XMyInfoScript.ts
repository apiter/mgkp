import { _decorator, Component, Label, Node } from 'cc';
import XMgr from '../../XMgr';
import { XGameStatus } from '../../xconfig/XEnum';
const { ccclass, property } = _decorator;

@ccclass('XMyInfoScript')
export class XMyInfoScript extends Component {

    @property(Label)
    lbCoin: Label = null
    @property(Label)
    lbEnergy: Label = null

    update(deltaTime: number) {
        if (XMgr.gameMgr.gameStatus != XGameStatus.E_GAME_FINISH && XMgr.playerMgr.isPlayerBed(XMgr.playerMgr.mineUuid)) {
            let player = XMgr.playerMgr.player;
            if (!player || !player.coin) return;
            this.lbCoin.string = this.unitNumToString(player.coin)
            this.lbEnergy.string = this.unitNumToString(player.energy)
        }
    }


    unitNumToString(num_: number) {
        let t = num_.toString();
        return num_ > 999999999 ? t = Math.floor(num_ / 1e6).toString() + "M" : num_ > 999999 && (t = Math.floor(num_ / 1e3).toString() + "K"), t
    }
}


