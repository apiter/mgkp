import { XBTCondition } from "../bt2/XBTCondition";
import { XBTCategory } from "../bt2/XBTEnum";
import { XPlayerScript } from "../view/player/XPlayerScript";
import XMgr from "../XMgr";
import { XRandomUtil } from "../xutil/XRandomUtil";

export class XFindMapBuildAct extends XBTCondition {
    static NAME = "XFindMapBuildAct"
    lastMapBuild = null

    constructor(child_ = null) {
        super({
            name: XFindMapBuildAct.NAME,
            title: "",
            properties: null,
            child: child_
        })
    }
    satisfy(data_) {
        let target = data_.target as XPlayerScript;
        if (target.getTakeMapBuild()) {
            target.setMapBuildTarget(null),
                this.lastMapBuild = undefined
            return false;
        }
        let s, findBuild = this.lastMapBuild;
        if (!this.lastMapBuild || (s = this.lastMapBuild.isUsed)) {
            let randomBuildArr = XMgr.buildingMgr.mapBuildScriptArr;
            randomBuildArr = XRandomUtil.randomArrayEx(randomBuildArr);
            for (const build of randomBuildArr) {
                //@ts-ignore
                if (!build.isTarget && !build.isUsed) {
                    //@ts-ignore
                    build.isTarget = true
                    findBuild = build;
                    break
                }
            }
        }
        if (findBuild) {
            target.setMapBuildTarget(findBuild);
            target.setCurTarget(findBuild);
            this.lastMapBuild = findBuild;
            return true;
        } else {
            target.setMapBuildTarget(null);
            this.lastMapBuild = void 0;
            return false;
        }
    }
}
XFindMapBuildAct.register(XFindMapBuildAct.NAME, XBTCategory.ACTION);

