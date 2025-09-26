import { _decorator, Component, Node } from 'cc';
import { XBuildingScript } from './XBuildingScript';
import XMgr from '../../XMgr';
import { XGameMode } from '../../xconfig/XEnum';
import XUtil from '../../xutil/XUtil';
const { ccclass, property } = _decorator;

@ccclass('XMagicBoxScript')
export class XMagicBoxScript extends XBuildingScript {
    onInit(): void {
        if (XMgr.gameMgr.gameMode == XGameMode.E_Defense) {
            if (this.data.playerUuid == XMgr.playerMgr.mineUuid) {
                XMgr.gameMgr.randomCnt += 1;
            } else {
                let player = XMgr.playerMgr.getPlayer(this.data.playerUuid);
                if (player) player.randomCnt += 1;
            }
        } else {
            let player = XMgr.playerMgr.getPlayer(this.data.playerUuid);
            if (player) player.randomCnt += 1;
        }

        this.scheduleOnce(this.randomBuild, 1)
    }

    randomBuild() {
        const magicAllList = XMgr.cfg.magicBoxCfg.values()
        const magicOkList: { sid: string, weight: number }[] = []
        for (let cfg of magicAllList) {
            let sidSplited = cfg.sid.split("_"),
                buildId = Number(sidSplited[0]),
                buildLv = Number(sidSplited[1]),
                buildCfg = XMgr.buildingMgr.getBuildCfg(buildId, buildLv),
                isThisOk = true;
            if (buildCfg) {
                if (buildCfg.maxCnt) {
                    let player = XMgr.playerMgr.player,
                        i = 0;
                    for (const t of player.buildings)
                        if (t.id == buildCfg.buildId && ++i == buildCfg.maxCnt) {
                            isThisOk = false;
                            break
                        }
                }
            }
            isThisOk && magicOkList.push({
                sid: cfg.sid,
                weight: cfg.weight
            })
        }

        const randResult = XUtil.takeOneByWeight(magicOkList)
        if (randResult) {
            let sidSplited = randResult.sid.split("_")
            let buildId = Number(sidSplited[0])
            let buildLv = Number(sidSplited[1])
            // buildCfg = XMgr.buildingMgr.getBuildCfg(buildId, buildLv)
            XMgr.buildingMgr.destroyBuilding(XMgr.playerMgr.mineUuid, this.data.x, this.data.y, !1)
            XMgr.buildingMgr.buildFree(this.data.playerUuid, buildId, this.data.x, this.data.y, 0, buildLv)
        }
    }
}


