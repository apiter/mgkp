import { _decorator, Component, Node } from 'cc';
import XMgr from './battle/ts/XMgr';

export class XBattleEntrance {
    static async loadRes() {
        XMgr.init()
        let ret = await XMgr.cfg.load()
        console.log("Battle Res Load Ret:", ret)
        const mapCfg = XMgr.cfg.mapCfg.get("1")
        const mapData = XMgr.cfg.mapDatas.get("map1")
        XMgr.mapMgr.init(mapData)
    }
}


