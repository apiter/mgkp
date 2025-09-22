import { XBatleMgr } from "./map/XBatleMgr";
import XBuildingMgr from "./map/XBuildingMgr";
import XBulletMgr from "./map/XBulletMgr";
import { XMapMgr } from "./map/XMapMgr";
import XPlayerMgr from "./player/XPlayerMgr";
import { XGameUI } from "./view/game/XGameUI";
import { XPrefabMgr } from "./view/XPrefabMgr";
import XCfgMgr from "./xconfig/XCfgMgr";

class XMgr {
    gameMgr: XBatleMgr = null
    playerMgr: XPlayerMgr = null;
    mapMgr: XMapMgr = null;
    buildingMgr: XBuildingMgr = null;
    bulletMgr: XBulletMgr = null
    cfg: XCfgMgr = null
    gameTime: Date = new Date
    gameUI:XGameUI = null
    prefabMgr:XPrefabMgr = null

    init() {
        this.cfg = new XCfgMgr()
        this.gameMgr = new XBatleMgr();
        this.playerMgr = new XPlayerMgr();
        this.mapMgr = new XMapMgr();
        this.bulletMgr = new XBulletMgr()
        this.buildingMgr = new XBuildingMgr();
    }
}
export default new XMgr();

