import { XBatleMgr } from "./map/XBatleMgr";
import XBuildingMgr from "./map/XBuildingMgr";
import { MapMgr } from "./map/XMapMgr";
import XPlayerMgr from "./player/XPlayerMgr";
import XUser from "./player/XUser";
import XCfgMgr from "./xconfig/XCfgMgr";

class XMgr {
    gameMgr: XBatleMgr = new XBatleMgr();
    playerMgr: XPlayerMgr = new XPlayerMgr();
    mapMgr = new MapMgr();
    buildingMgr = new XBuildingMgr();
    user: XUser = new XUser();
    cfg:XCfgMgr = new XCfgMgr()
    gameTime:Date
}
export default new XMgr();

