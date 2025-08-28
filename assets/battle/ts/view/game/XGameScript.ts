import { _decorator, Component, log, Node, Sprite, UITransform, v2, Vec2 } from 'cc';
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
import { XInputScript } from '../XInputScript';
import XPlayerModel from '../../model/XPlayerModel';
import { XV2Util01 } from '../../xutil/XV2Util01';
const { ccclass, property } = _decorator;

@ccclass('XGameScript')
export class XGameScript extends Component {
    map: XMapView = null
    buildingGrids: XBuildingScript[][] = []

    defenders: XDefenderScript[] = []
    hunters: XHunterScript[] = []

    characterControl: XPlayerScript = null
    inputScript: XInputScript = null

    isPlayerBed = true
    mapMoveSpeed = 1.5
    moveDir: Vec2 = v2(0)

    moveTime = 0

    protected onLoad(): void {
        this.map = this.node.getChildByName("map").getComponent(XMapView)
    }

    protected onDestroy(): void {
        this.offEvents()
    }

    async init() {
        this.inputScript = XMgr.gameMgr.inputScript
        this.inputScript.downHandler = this.onDown.bind(this)
        this.inputScript.moveHandler = this.onInputMove.bind(this)
        this.inputScript.clickHandler = this.onClickMap.bind(this)

        this.map.init()
        this.initEvents()
        this.initBuildings()
        this.initDefenders()
        this.initHunters()

        this.onInit()
    }

    initEvents() {
        EventCenter.on(XEventNames.E_BUILDING_BUILD, this.build, this)
        EventCenter.on(XEventNames.E_Look_Player, this.lookAtPlayer, this)
    }

    offEvents() {
        EventCenter.off(XEventNames.E_BUILDING_BUILD, this.build, this)
        EventCenter.off(XEventNames.E_Look_Player, this.lookAtPlayer, this)
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
            let defNode = new Node(`defender${i}`);
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
            defNode.active = defender.uuid == myUuid
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

    onInit() {
        this.printCharactorPos("onInit")
        this.lookAt(this.characterControl.node.worldPositionX, this.characterControl.node.worldPositionY)
    }

    printCharactorPos(premsg:string = "") {
        const lookX = this.characterControl.node.worldPositionX
        const lookY = this.characterControl.node.worldPositionY
        console.debug(`${premsg} characterControl:${this.characterControl.node.name}, x:${lookX} y:${lookY}`)
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

    onDown() {
    }

    onInputMove(deltaX, deltaY) {
        if (!this.isPlayerBed || this.characterControl) return;
        let moveX = this.mapMoveSpeed * deltaX,
            moveY = this.mapMoveSpeed * deltaY;
        // this.map.lookPos.x -= moveX
        // this.map.lookPos.y -= moveY
        const mapWorldPt = this.map.node.worldPosition

        this.lookAt(mapWorldPt.x - moveX, mapWorldPt.y - moveY)
    }
    onClickMap(e) { }

    lookAt(worldX, worldY) {
        this.map.lookAt(worldX, worldY)
        this.map.updateArea()
    }

    lookAtPlayer(player_: XPlayerModel) {
        player_?.owner?.isValid && this.lookAt(player_.owner.worldPositionX, player_.owner.worldPositionY)
    }

    protected update(dt: number): void {
        this.updateMove(dt)
    }

    updateMove(dt) {
        if (!this.characterControl) return;
        if (0 == this.inputScript.input.x && 0 == this.inputScript.input.y) {
            this.moveTime = 0
            this.characterControl.isAtking || this.characterControl.idle()
            return
        }
        const t033 = 0.033
        this.moveTime += t033
        this.moveTime >= .5 && (this.moveTime = 0);
        this.moveDir.set(this.inputScript.input.x, this.inputScript.input.y)
        this.moveDir.normalize()
        // this.characterControl.img_addSpeed && XV2Util01.faceWith(this.characterControl.img_addSpeed, this.moveDir.x, this.moveDir.y);
        let speedPow = this.characterControl.data ? this.characterControl.data.getSpeedPow() : 1
        let speed = this.characterControl.moveSpeed * speedPow * this.characterControl.moveSpeedScale
        let x = speed * t033 * this.moveDir.x
        let y = speed * t033 * this.moveDir.y
        this.characterControl.move(x, y, !0)
        this.printCharactorPos("update1")
        this.lookAt(this.characterControl.node.worldPositionX, this.characterControl.node.worldPositionY)
        this.printCharactorPos("update2")
    }
}


