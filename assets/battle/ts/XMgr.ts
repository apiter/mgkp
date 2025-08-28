import { XBatleMgr } from "./map/XBatleMgr";
import XBuildingMgr from "./map/XBuildingMgr";
import { XMapMgr } from "./map/XMapMgr";
import XPlayerMgr from "./player/XPlayerMgr";
import XUser from "./player/XUser";
import { XInputScript } from "./view/XInputScript";
import XCfgMgr from "./xconfig/XCfgMgr";

class XMgr {
    gameMgr: XBatleMgr = null
    playerMgr: XPlayerMgr = null;
    mapMgr:XMapMgr = null;
    buildingMgr:XBuildingMgr = null;
    user: XUser = null;
    cfg: XCfgMgr = null
    gameTime: Date = new Date

    init() {
        this.cfg = new XCfgMgr()
        this.gameMgr = new XBatleMgr();
        this.playerMgr = new XPlayerMgr();
        this.mapMgr = new XMapMgr();
        this.buildingMgr = new XBuildingMgr();
        this.user = new XUser();
    }
}
export default new XMgr();

