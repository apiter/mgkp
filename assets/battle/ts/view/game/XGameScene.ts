import { _decorator, Component, Node } from 'cc';
import XMgr from '../../XMgr';
import { XGameMode, XPlayerType } from '../../xconfig/XEnum';
import { XDefenseGameScript } from './XDefenseGameScript';
import { XBattleEntrance } from 'db://assets/XBattleEntrance';
import { XGameScript } from './XGameScript';
import { XRandomUtil } from '../../xutil/XRandomUtil';
import XPlayerModel from '../../model/XPlayerModel';
import XUtil from '../../xutil/XUtil';
import { XInputScript } from '../XInputScript';
import LogWrapper, { XLogModule } from '../../log/LogWrapper';
const { ccclass, property } = _decorator;

@ccclass('XGameScene')
export class XGameScene extends Component {
    @property(Node)
    gameNode: Node = null

    @property(Node)
    inputNode: Node = null

    gameScript: XGameScript = null

    protected async onLoad() {
        //must be first 
        await XBattleEntrance.loadRes()
        const matchData = this.generateMatchData()
        XMgr.gameMgr.start(matchData)

        XMgr.gameMgr.inputScript = this.inputNode.getComponent(XInputScript)

        if (XMgr.gameMgr.gameMode === XGameMode.E_Defense) {
            this.gameScript = this.gameNode.addComponent(XDefenseGameScript)
            this.gameScript.init()
        }
    }

    private generateMatchData() {
        let hunterArr: XPlayerModel[] = []
        let defenderArr: XPlayerModel[] = []

        let diffCfg = XMgr.cfg.difficultCfg.get("1");
        XMgr.gameMgr.dCfg = diffCfg;
        let addMaxHp = diffCfg.addMaxHp + 1;
        let hunterModel = new XPlayerModel;
        hunterModel.type = XPlayerType.E_Hunter
        hunterModel.uuid = XUtil.createUUIDEx(10)
        hunterModel.name = "随机名字"
        hunterModel.skinId = diffCfg.bossId
        hunterModel.attackPower = XMgr.cfg.hunterCfg.attackList[0]
        hunterModel.curHp = XMgr.cfg.hunterCfg.hpList[0] * addMaxHp
        hunterModel.maxHp = hunterModel.curHp
        hunterArr.push(hunterModel)

        for (let i = 0; i < 6; ++i) {
            let playerModel = new XPlayerModel;
            playerModel.type = XPlayerType.E_Defender
            playerModel.uuid = XUtil.createUUIDEx(10)
            playerModel.name = "随机名字"
            playerModel.skinId = XRandomUtil.randomInArray(XMgr.cfg.getPlayerIdArr())
            defenderArr.push(playerModel)
        }
        let mapCfg = XMgr.cfg.mapCfg.get("2")
        let mapData = XMgr.cfg.mapDatas.get("map2")
        let data = XMgr.gameMgr.match(XGameMode.E_Defense, defenderArr, hunterArr, mapCfg, mapData)
        return data
    }
}


