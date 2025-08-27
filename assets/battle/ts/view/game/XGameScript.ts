import { _decorator, Component, Node, Sprite, UITransform, Vec2 } from 'cc';
import XMgr from '../../XMgr';
import XBuildingModel from '../../model/XBuildingModel';
import { XBuildType } from '../../xconfig/XEnum';
import { XDoorScript } from '../building/XDoorScript';
import { XBedScript } from '../building/XBedScript';
import { XTowerScript } from '../building/XTowerScript';
import { XMapView } from '../XMapVIew';
import { XRandomUtil } from '../../xutil/XRandomUtil';
import { XBuildingScript } from '../building/XBuildingScript';
import EventCenter from '../../event/EventCenter';
import { XEventNames } from '../../event/XEventNames';
import { XCatBedScript } from '../building/XCatBedScript';
import { XConst } from '../../xconfig/XConst';
import XAtlasLoader from 'db://assets/XAtlasLoader';
import { XDefenderScript } from '../player/XDefenderScript';
import { XPlayerScript } from '../player/XPlayerScript';
import { XHunterScript } from '../player/XHunterScript';
const { ccclass, property } = _decorator;

@ccclass('XGameScript')
export class XGameScript extends Component {
    map: XMapView = null
    buildingGrids: XBuildingScript[][] = []

    defenders: XDefenderScript[] = []
    hunters: XHunterScript[] = []

    characterControl: XPlayerScript = null

    protected onLoad(): void {
        this.map = this.node.getChildByName("map").getComponent(XMapView)

        EventCenter.on(XEventNames.E_BUILDING_BUILD, this.build, this)
    }

    protected onDestroy(): void {
        EventCenter.off(XEventNames.E_BUILDING_BUILD, this.build, this)
    }

    async init() {
        this.map.init()
        this.initBuildings()
        this.initDefenders()
        this.initHunters()
    }

    initBuildings() {
        let buildings = XMgr.buildingMgr.buildings;
        for (const build of buildings) {
            this.build(build, true)
            // build.type == XBuildType.door && this.map.createDoorTips(build.x, build.y, build.rotation)
        }

    }

    initDefenders() {
        let myUuid = XMgr.playerMgr.mineUuid
        let defenderArr = XMgr.playerMgr.defenders
        for (let i = 0; i < defenderArr.length; ++i) {
            let defender = defenderArr[i]
            let defNode = new Node;
            defNode.addComponent(UITransform).setContentSize(1, 1)
            this.map.playerLayer.addChild(defNode);
            let defenderScript = defNode.addComponent(XDefenderScript);
            defenderScript.init(defender);
            let spawnPos = XMgr.mapMgr.getDefenderSpawnPos(defender.spwanPoint);
            if (!spawnPos) {
                let targetTile = null;
                for (const tiles of XMgr.mapMgr.getMapTiles())
                    for (const tile of tiles)
                        if (-1 !== tile.groundBlock.indexOf("floor_2")) {
                            targetTile = tile;
                            break
                        }
                if (targetTile)
                    spawnPos = XMgr.mapMgr.gridPosToMapPos(targetTile.x, targetTile.y);
                else {
                    let e = XConst.GridSize;
                    spawnPos = new Vec2(XMgr.mapMgr.width * e / 2, XMgr.mapMgr.height * e / 2)
                }
            }
            defenderScript.pos(spawnPos.x, spawnPos.y)
            this.defenders.push(defenderScript)
            defender.uuid == myUuid && (this.characterControl = defenderScript)
        }
    }

    initHunters() {
        let myUuid = XMgr.playerMgr.mineUuid
        let hunters = XMgr.playerMgr.hunters;
        for (let i = 0; i < hunters.length; ++i) {
            let hunterModel = hunters[i]
            let huntNode = new Node
            huntNode.addComponent(UITransform).setContentSize(1, 1)
            this.map.hunterLayer.addChild(huntNode);
            let script = huntNode.addComponent(XHunterScript);
            script.init(hunterModel);
            let spawnPos = XMgr.mapMgr.getHunterSpawnPos(hunterModel.spwanPoint);
            script.pos(spawnPos.x, spawnPos.y)
            this.hunters.push(script)
            if (hunterModel.uuid == myUuid) {
                this.characterControl = script;
                break
            }
        }
    }

    build(build_: XBuildingModel, s, cdTime_ = 0) {
        let buildNode = new Node;
        buildNode.addComponent(UITransform).setContentSize(XConst.GridSize, XConst.GridSize)
        build_.owner = buildNode
        let buildScript: XBuildingScript
        let mapPos = XMgr.mapMgr.gridPosToMapPos(build_.x, build_.y)
        let canMove = false
        let buildCfg = XMgr.buildingMgr.getBuildCfg(build_.id)
        if (buildCfg.type == XBuildType.door)
            buildScript = buildNode.addComponent(XDoorScript);
        else if (buildCfg.type == XBuildType.bed) {
            buildScript = buildNode.addComponent(XBedScript)
            if (1001 == build_.id) {
            }
        } else if (buildCfg.type == XBuildType.tower) {
            switch (buildCfg.buildId) {
                case 3000:
                    buildScript = buildNode.addComponent(XTowerScript)
                    break
                //TOOD 其他
                default: break;
            }
        } else {
            if (buildCfg.type == XBuildType.eatMosquito) {
            } else if (buildCfg.type == XBuildType.springBox) {
            } else if (buildCfg.type == XBuildType.knife) {
            } else if (buildCfg.type == XBuildType.random) {
                // r = n.addComponent(Wi);
            } else if (buildCfg.type == XBuildType.mine) {
                if ([5002, 5103, 5104, 5105, 5106].indexOf(buildCfg.buildId) >= 0) {
                    buildScript = buildNode.addComponent(XCatBedScript);
                } else {
                    buildScript = buildNode.addComponent(XBuildingScript);
                }
            } else if (buildCfg.type == XBuildType.entice) {
            } else if (buildCfg.type == XBuildType.stone) {
            } else if (buildCfg.type == XBuildType.boxMonster) {
            } else if (buildCfg.type == XBuildType.doorkeeper) {
            } else if (buildCfg.type == XBuildType.borrowMoney) {
            } else if (buildCfg.buildId == 6006) {
            } else {
                buildScript = buildNode.addComponent(XBuildingScript);
            }
        }
        this.buildingGrids[build_.x] || (this.buildingGrids[build_.x] = [])
        canMove ? this.map.buildMoveLayer.addChild(buildNode) : this.map.buildLayer.addChild(buildNode)
        buildNode.x = mapPos.x
        buildNode.y = mapPos.y
        this.buildingGrids[build_.x][build_.y] = buildScript
        buildScript.init(build_, cdTime_)
        buildScript.map = this.map
    }
}


