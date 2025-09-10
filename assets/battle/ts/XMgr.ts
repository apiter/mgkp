import { XBatleMgr } from "./map/XBatleMgr";
import XBuildingMgr from "./map/XBuildingMgr";
import XBulletMgr from "./map/XBulletMgr";
import { XMapMgr } from "./map/XMapMgr";
import XPlayerMgr from "./player/XPlayerMgr";
import XUser from "./player/XUser";
import XCfgMgr from "./xconfig/XCfgMgr";

class XMgr {
    gameMgr: XBatleMgr = null
    playerMgr: XPlayerMgr = null;
    mapMgr:XMapMgr = null;
    buildingMgr:XBuildingMgr = null;
    bulletMgr:XBulletMgr = null
    user: XUser = null;
    cfg: XCfgMgr = null
    gameTime: Date = new Date

    init() {
        this.cfg = new XCfgMgr()
        this.gameMgr = new XBatleMgr();
        this.playerMgr = new XPlayerMgr();
        this.mapMgr = new XMapMgr();
        this.bulletMgr = new XBulletMgr()
        this.buildingMgr = new XBuildingMgr();
        this.user = new XUser();
    }
}
export default new XMgr();

