import XMgr from "../XMgr";
import XUtil from "../xutil/XUtil";
import { XBuildData } from "./XBuildData";

export default class XGameInfo {
    maxLevel = 1;
    winCnt = 0;
    failCnt = 0;
    ownBuild: Map<number, { cnt: number }> = new Map();
    ownSkin: Map<number, { cnt: number, isUnlock: boolean }> = new Map();
    ownSkinFragment: Map<number, { cnt: number, cnt_1: number }> = new Map();
    skinTypeShow: Map<number, { id: number }> = new Map();

    constructor() {
        this.clear()
    }
    clear() {
        this.maxLevel = 1
        this.winCnt = 0
        this.failCnt = 0
        this.clearOwnBuild()
    }


    clearOwnBuild() {
        this.ownBuild = new Map
        XMgr.cfg.shopCfg.forEach(e => {
            let t = new XBuildData;
            t.cnt = e.initialHave, this.ownBuild.set(e.buildId, t)
        })
    }
}


