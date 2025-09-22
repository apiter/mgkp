import { _decorator, Component, Node, Sprite } from 'cc';
import XMgr from '../../XMgr';
import { XPlayerType } from '../../xconfig/XEnum';
import XResUtil from '../../xutil/XResUtil';
import XPlayerModel from '../../model/XPlayerModel';
import EventCenter from '../../event/EventCenter';
import { XEventNames } from '../../event/XEventNames';
const { ccclass, property } = _decorator;

@ccclass('XPlayerHeadScript')
export class XPlayerHeadScript extends Component {

    protected onLoad(): void {
        EventCenter.once(XEventNames.E_RES_READY, this.onResReady, this)
    }

    onResReady() {
        this.initPlayers()
        this.initHunters()
    }

    initPlayers() {
        let players: XPlayerModel[] = [];
        for (let defenderIdx = 0; defenderIdx < XMgr.playerMgr.defenders.length; defenderIdx++) {
            let defender = XMgr.playerMgr.defenders[defenderIdx];
            defender.uuid != XMgr.playerMgr.mineUuid && players.push(defender)
        }
        XMgr.playerMgr.player.type == XPlayerType.E_Defender && players.push(XMgr.playerMgr.player)

        for (let i = 0; i < players.length; ++i) {
            const cfg = XMgr.cfg.skin.get(players[i].skinId + "");
            const headerNode = this.node.getChildByName(i.toString())
            const iconNode = headerNode.getChildByName("icon")
            let iconSprite = iconNode.getComponent(Sprite)

            XResUtil.loadSpriteFromBundle(XResUtil.ResBundleName, cfg.headIcon.replace(".png", "")).then((frame) => {
                iconSprite.spriteFrame = frame
            })

            headerNode.on(Node.EventType.TOUCH_END, () => {
                if(XMgr.gameMgr.canLocatePlayer()) {
                    EventCenter.emit(XEventNames.E_Look_Player, players[i])
                }
            }, this)
        }
    }

    initHunters() {
        const hunter = XMgr.playerMgr.hunters[0]
        const cfg = XMgr.cfg.skin.get(hunter.skinId + "");
            const headerNode = this.node.getChildByName("6")
            const iconNode = headerNode.getChildByName("icon")
            let iconSprite = iconNode.getComponent(Sprite)

            XResUtil.loadSpriteFromBundle(XResUtil.ResBundleName, cfg.headIcon.replace(".png", "")).then((frame) => {
                iconSprite.spriteFrame = frame
            })

            headerNode.on(Node.EventType.TOUCH_END, () => {
                if(XMgr.gameMgr.canLocatePlayer()) {
                    EventCenter.emit(XEventNames.E_Look_Player, hunter)
                }
            }, this)
    }
}


