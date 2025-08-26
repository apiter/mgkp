import { _decorator, Component, Node } from 'cc';
import XMgr from '../../XMgr';
import XBuildingModel from '../../model/XBuildingModel';
import { XBuildType } from '../../xconfig/XEnum';
import { XDoorScript } from '../building/XDoorScript';
import { XBedScript } from '../building/XBedScript';
import { XTowerScript } from '../building/XTowerScript';
import { XMapView } from '../XMapVIew';
import { XRandomUtil } from '../../xutil/XRandomUtil';
import { XBuildingScript } from '../building/XBuildingScript';
const { ccclass, property } = _decorator;

@ccclass('XGameScript')
export class XGameScript extends Component {
    map: XMapView = null
    buildingGrids: XBuildingScript[][] = []

    protected onLoad(): void {
        this.map = this.node.getChildByName("map").getComponent(XMapView)
    }

    init() {
        this.map.init()
        this.initBuildings()
    }

    initBuildings() {
        let buildings = XMgr.buildingMgr.buildings;
        for (const build of buildings) {
            this.build(build, true)
            // build.type == XBuildType.door && this.map.createDoorTips(build.x, build.y, build.rotation)
        }

    }

    build(build_: XBuildingModel, s, a = 0) {
        let buildNode = new Node;
        build_.owner = buildNode
        let buildScript, mapPos = XMgr.mapMgr.gridPosToMapPos(build_.x, build_.y)
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
            }
        }
        this.buildingGrids[build_.x] || (this.buildingGrids[build_.x] = [])
        canMove ? this.map.buildMoveLayer.addChild(buildNode) : this.map.buildLayer.addChild(buildNode)
        buildNode.x = mapPos.x
        buildNode.y = mapPos.y
        this.buildingGrids[build_.x][build_.y] = buildScript
        buildScript.init(build_, a)
        buildScript.map = this.map
    }
}


